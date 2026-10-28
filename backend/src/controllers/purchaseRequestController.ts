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
            `INSERT INTO solicitacoes (solicitante, status, criado_em)
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