import { NextFunction, Request, Response } from 'express'

export function deptCompra(request: Request, response: Response, next: NextFunction) {

    const admin = 'admin'
    const deptCompra = 'COMPRAS'

    if (request.login?.cargo !== deptCompra && request.login?.cargo !== admin){
        return response.status(403).json({ message: 'Acesso negado' })
    } 

    next()

}

export function ehAdmin(request: Request, response: Response, next: NextFunction){

    const admin = 'admin'

    if (request.login?.cargo !== admin){
        return response.status(403).json({ message: 'Acesso negado' })
    }

    next()

}