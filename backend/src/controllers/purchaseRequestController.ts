import type { Request, Response } from 'express'
import { pool } from '../config/env.js'

export async function solicitacaoCompra(request: Request, response: Response){

    const { descricao, quantidade } = request.body

    if (!descricao || !quantidade){
        return response.status(400).json({
            message: 'Preencha todos os campos'
        })
    }

    if (!request.login?.login){
        return response.status(401).json({
            message: 'Não autenticado'
        })
    }

    let client

    try{

        client = await pool.connect()

        await client.query('BEGIN')

        const solicitante = await client.query(
            `SELECT id FROM usuario WHERE login = $1`,
            [request.login?.login]
        )

        const solicitanteId = solicitante.rows[0]?.id

        const status = 'PENDENTE'

        const resultado = await client.query(
            `INSERT INTO solicitacoes (id_solicitante, status, criado_em)
            VALUES ($1, $2, CURRENT_DATE)
            RETURNING id`,
            [solicitanteId, status]
        )

        const solicitacaoId = resultado.rows[0].id

        await client.query(
            `INSERT INTO itens_solicitacao (solicitacao_id, descricao, quantidade)
            VALUES ($1, $2, $3)`,
            [solicitacaoId, descricao, quantidade]
        )

        await client.query('COMMIT')

        return response.status(201).json({
            message: 'Solicitação criada com sucesso!'
        })

    } catch(error){
        console.error(error)

        await client?.query('ROLLBACK')

        return response.status(500).json({
            message: 'Erro interno do servidor'
        })
    } finally{
        client?.release()
    }


}

export async function atualizarStatus(request: Request, response: Response){

    const { status } = request.body

    const { id } = request.params

    const numericId:number = Number(id)

    if (!Number.isInteger(numericId) || numericId <= 0){
        return response.status(400).json({
            message: `Erro no id da solicitação. Id recebido: ${id}`
        })
    }

    if (status !== 'APROVADA' && status !== 'REJEITADA' && status !== 'PENDENTE'){
        return response.status(400).json({
            message: 'Erro no status.'
        })
    }

    try {

        const resultado = await pool.query(
            `UPDATE solicitacoes
            SET status = $1
            WHERE id = $2
            RETURNING id, status`,
            [status, numericId]
        )

        if (resultado.rowCount === 0){
            return response.status(404).json({
                message: 'Erro na solicitação. Nenhuma linha foi atualizada.'
            })
        }

    return response.status(200).json({
            message: 'Solicitação atualizada com sucesso!',
            solicitacao: resultado.rows[0]
        })

    } catch(error){
        console.error(error)

        return response.status(500).json({
            message: 'Erro interno do servidor'
        })
    }

}