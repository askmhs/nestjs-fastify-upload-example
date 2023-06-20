import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';
import * as util from 'util';
import * as stream from 'stream';
import { createWriteStream } from 'fs';

@Injectable()
export class UploadService {
  async upload(req: FastifyRequest, res: FastifyReply<any>) {
    return req.multipart(this.handler, (error: Error) => {
      if (error) {
        return res.send(
          new InternalServerErrorException('Internal server error'),
        );
      }

      return res.code(200).send({
        message: 'File uploaded successfully',
      });
    });
  }

  async handler(
    field: string,
    file: any,
    filename: string,
    encoding: string,
    mimetype: string,
  ): Promise<void> {
    const pipeline = util.promisify(stream.pipeline);
    const extension = mimetype ? mimetype.split('/').pop() : 'png';
    const writeStream = createWriteStream(
      `./public/${new Date().getTime()}.${extension}`,
    ); //File path

    try {
      await pipeline(file, writeStream);
    } catch (err) {
      console.error('Pipeline failed', err);
    }
  }
}
