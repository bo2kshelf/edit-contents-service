import {Injectable} from '@nestjs/common';
import {IDService} from '../../common/id/id.service';
import {Neo4jService} from '../../neo4j/neo4j.service';
import {AuthorEntity} from '../entities/author.entity';
import {AuthorRole} from '../entities/roles.enitty';
import {WritingEntity} from '../entities/writing.entity';

@Injectable()
export class AuthorsService {
  constructor(
    private readonly neo4jService: Neo4jService,
    private readonly idService: IDService,
  ) {}

  async create(data: {name: string}): Promise<AuthorEntity> {
    const result = await this.neo4jService.write(
      `
      CREATE (a:Author {id: $id})
      SET a += $data
      RETURN a.id AS a
      `,
      {
        id: this.idService.generate(),
        data,
      },
    );
    if (result.records.length === 0) throw new Error('Not Found');
    return {id: result.records[0].get('a')};
  }

  async writedBook(
    {authorId, bookId}: {authorId: string; bookId: string},
    {roles = [AuthorRole.AUTHOR]}: {roles?: AuthorRole[]},
  ): Promise<WritingEntity> {
    const result = await this.neo4jService.write(
      `
        MATCH (a:Author {id: $authorId})
        MATCH (b:Book {id: $bookId})
        MERGE (a)-[r:WRITED_BOOK]->(b)
        SET r = $props
        RETURN a.id AS a, b.id AS b, r.roles AS roles
      `,
      {bookId, authorId, props: {roles}},
    );
    return result.records.map((record) => ({
      authorId: record.get('a'),
      bookId: record.get('b'),
      roles: record.get('roles'),
    }))[0];
  }
}
