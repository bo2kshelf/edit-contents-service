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
    const result = await this.neo4jService.write(
      `
      CREATE (b:Book {id: $id})
      SET b += $data
      RETURN b.id AS b
    `,
      {id: this.idService.generate(), data},
    );
    return {id: result.records[0].get('b')};
  }
}
