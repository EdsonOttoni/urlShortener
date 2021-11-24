import {Request, response, Response} from "express";
import shortId from 'shortid'
import { config } from "../config/Constants";
import { URLModel } from "../Database/model/URL";

export class URLController {
  public async shorten(req: Request, res: Response): Promise<void>{
    const { originURL } = req.body
    const url = await URLModel.findOne({originURL})
    
    if(url) {
      response.json(url)
      return
    }

    const hash = shortId.generate()
    const shortURL = `${config.API_URL}/${hash}`
    const newModel = await URLModel.create({hash, shortURL, originURL})

    res.json(newModel)
  }

  public async redirect(req: Request, res: Response): Promise<void>{
    const { hash } = req.params
    const url = await URLModel.findOne({hash})

    if(url){
      res.redirect(url.originURL)
      return
    }

    res.status(400).json({error: 'URL not found'})
  }
}