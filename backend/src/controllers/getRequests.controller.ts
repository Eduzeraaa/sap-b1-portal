import type { Request, Response } from 'express'
import { pool } from '../config/env.js'

export async function getPurchaseRequests(request:Request, response:Response) {
    
    try {

        const getRequests = await pool.query(
            `SELECT 
                s.id AS id_solicitacao,
                u.login AS nome_solicitante,
                s.id_solicitante,
                i.id AS id_produto,
                s.status AS status,
                i.descricao AS descricao_produto,
                i.quantidade AS quantidade_produto,
                s.criado_em AS data_pedido
            FROM solicitacoes s
            JOIN itens_solicitacao i ON i.solicitacao_id = s.id
            JOIN usuario u ON s.id_solicitante = u.id`
        )

        return response.status(200).json({
            solicitacoes: getRequests.rows
        })
    } catch(error){
        console.error(error)
        return response.status(500).json({
            message: 'Erro interno do servidor.'
        })
    }

}

export async function getPurchaseRequestById(request:Request, response:Response) {
    
    const { id } = request.params

    if (typeof id !== 'string') {
        return response.status(400).json({
            message: 'ID inválido.'
        })
    }

    const numericId = Number(id)

    if (!Number.isInteger(numericId) || numericId <= 0){
        return response.status(400).json({
            message: `Erro no id da solicitação. Id recebido: ${id}`
        })
    }

    try{

        const getRequestById = await pool.query(
            `SELECT 
                s.id AS id_solicitacao,
                u.login AS nome_solicitante,
                s.id_solicitante,
                i.id AS id_produto,
                s.status AS status,
                i.descricao AS descricao_produto,
                i.quantidade AS quantidade_produto,
                s.criado_em AS data_pedido
            FROM solicitacoes s
            JOIN itens_solicitacao i ON i.solicitacao_id = s.id
            JOIN usuario u ON s.id_solicitante = u.id
            WHERE s.id = $1`,
            [numericId]
        )

        if (getRequestById.rows.length === 0) {
            return response.status(404).json({
                message: 'Solicitação não encontrada.'
            })
        }

        return response.status(200).json({
            solicitacao: getRequestById.rows
        })

    } catch(error){
        console.error(error)
        return response.status(500).json({
            'Message': 'Erro interno do servidor.'
        })
    }

}

export async function filtrarStatus(request: Request, response: Response) {
    
    const { status } = request.params

    if (status !== 'APROVADA' && status !== 'REJEITADA' && status !== 'PENDENTE'){
        return response.status(400).json({
            message: 'Erro no status.'
        })
    }

    try{

        const resultado = await pool.query(
            `SELECT 
                s.id AS id_solicitacao,
                u.login AS nome_solicitante,
                s.id_solicitante,
                i.id AS id_produto,
                s.status as status,
                i.descricao AS descricao_produto,
                i.quantidade AS quantidade_produto,
                s.criado_em AS data_pedido
            FROM solicitacoes s
            JOIN itens_solicitacao i ON i.solicitacao_id = s.id
            JOIN usuario u ON s.id_solicitante = u.id
            WHERE s.status = $1`,
            [status]
        )

        if (resultado.rows.length === 0) {
            return response.status(200).json({
                message: 'Nenhuma solicitação encontrada para esse status.',
                filtragem: []
            })
        }

        return response.status(200).json({
            message: 'Filtragem concluída!',
            filtragem: resultado.rows
        })

    } catch(error){
        console.error(error)

        return response.status(500).json({
            message: 'Erro interno do servidor'
        })
    }
    
}

export async function filterByUser(request: Request, response: Response){

    const { id } = request.params

    if (typeof id !== 'string') {
        return response.status(400).json({
            message: 'ID inválido.'
        })
    }

    const numericId = Number(id)

    if (!Number.isInteger(numericId) || numericId <= 0){
        return response.status(400).json({
            message: `Erro no id da solicitação. Id recebido: ${id}`
        })
    }

    try {
        
        const resultado = await pool.query(
            `SELECT
                s.id AS id_solicitacao,
                i.id AS id_produto,
                s.status as status,
                i.descricao AS descricao_produto,
                i.quantidade AS quantidade_produto,
                s.criado_em AS data_pedido
            FROM solicitacoes s
            JOIN itens_solicitacao i ON i.solicitacao_id = s.id
            WHERE u.id = $1`,
            [numericId]
        )

        return response.status(200).json({
            message: 'Filtragem concluída!',
            solicitacoes: resultado.rows
        })

    } catch(error){
        console.error(error)

        return response.status(500).json({
            message: 'Erro interno do servidor'
        })
    }

}

export async function resumoPedidos(request: Request, response: Response){
    
    try {

        const resultado = await pool.query(
            `SELECT status, COUNT(status) as quantidade FROM solicitacoes
            GROUP BY status`,
        )

        if (resultado.rows.length === 0) {
            return response.status(200).json({
                message: 'Nenhum pedido registrado.',
                filtragem: []
            })
        }

        return response.status(200).json({
            message: 'Filtragem concluída!',
            resumo: resultado.rows
        })

    } catch(error){
        console.error(error)

        return response.status(500).json({
            message: 'Erro interno do servidor'
        })
    }

}