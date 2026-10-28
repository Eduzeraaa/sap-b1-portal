import { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import { pool } from '../config/env.js'
import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '../config/env.js'

export async function cadastrarUsuario(req: Request, res: Response) {
    const { login, senha, cargo } = req.body

    if (!login || !senha || !cargo) {
        return res.status(400).json({
            message: 'Preencha todos os campos.'
        })
    }

    if (senha.length < 8) {
        return res.status(400).json({
            message: 'A senha deve ter pelo menos 8 caracteres.'
        })
    }

    try {
        // verificação de existencia de usuario
        const usuarioExistente = await pool.query(
            'SELECT id FROM usuario WHERE login = $1',
            [login]
        )

        if (usuarioExistente.rows.length > 0) {
            return res.status(409).json({
                message: 'Este login já está cadastrado.'
            })
        }

        const senhaHash = await bcrypt.hash(senha, 10)

        // salvar no banco
        await pool.query(
            `INSERT INTO usuario (login, senha_hash, cargo)
             VALUES ($1, $2, $3)`,
            [login, senhaHash, cargo]
        )

        return res.status(201).json({
            message: 'Usuário cadastrado com sucesso!'
        })

    } catch (error) {
        console.error(error)

        return res.status(500).json({
            message: 'Erro interno do servidor.'
        })
    }
}

export async function login(request:Request, response:Response){

    const { login, senha } = request.body

    if (!login || !senha){
        return response.status(400).json({
            message: 'Preencha todos os campos.'
        })
    }

    try{
        const resultado = await pool.query(
            `SELECT id, login, cargo, senha_hash FROM usuario WHERE login = $1`,
            [login]
        )

        const usuario = resultado.rows[0]

        if (!usuario) {
            return response.status(401).json({
                message: 'Login ou senha incorretos.'
            })
        }

        const senhaCorreta = await bcrypt.compare(
            senha,
            usuario.senha_hash
        )

        if (!senhaCorreta){
            return response.status(401).json({
                message: 'Login ou senha incorretos'
            })
        }

        const token = jwt.sign(
            {login: usuario.login, cargo: usuario.cargo},
            JWT_SECRET,
            {expiresIn: '7d'}
        )

        response.cookie('token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        return response.status(200).json({
            message: 'Login efetuado com sucesso!',
            login: usuario.login,
            cargo: usuario.cargo
        })
    } catch (error){
        console.error(error)

        return response.status(500).json({
            message: 'Erro interno do servidor'
        })
    }

}