import {Injectable} from '@nestjs/common';
import {IDService} from '../../common/id/id.service';
import {Neo4jService} from '../../neo4j/neo4j.service';
import {BookEntity} from '../entities/book.entity';

@Injectable()
export class BooksService {
  constructor(
    private readonly neo4jService: Neo4jService,
    private readonly idService: IDService,
  ) {}

  async create(data: {title: string; isbn?: string}): Promise<BookEntity> {
    const id = this.idService.generate();
    const result = await this.neo4jService.write(
      `
      CREATE (b:Book {id: $id})
      SET b += $data
      RETURN b
    `,
      {id, data},
    );
    return result.records[0].get(0).properties;
  }
}
