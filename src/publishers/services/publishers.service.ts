import {Injectable} from '@nestjs/common';
import {IDService} from '../../common/id/id.service';
import {Neo4jService} from '../../neo4j/neo4j.service';
import {PublicationEntity} from '../entities/publication.entity';
import {PublisherEntity} from '../entities/publisher.entity';

@Injectable()
export class PublishersService {
  constructor(
    private readonly neo4jService: Neo4jService,
    private readonly idService: IDService,
  ) {}

  async create(data: {name: string}): Promise<PublisherEntity> {
    const result = await this.neo4jService.write(
      `
      CREATE (n:Publisher {id: $id})
      SET n += $data
      RETURN n
      `,
      {
        id: this.idService.generate(),
        data,
      },
    );
    return result.records[0].get(0).properties;
  }

  async publishedBook({
    bookId,
    publisherId,
  }: {
    bookId: string;
    publisherId: string;
  }): Promise<PublicationEntity> {
    return this.neo4jService
      .write(
        `
        MATCH (p:Publisher {id: $publisherId})
        MATCH (b:Book {id: $bookId})
        MERGE (p)-[:PUBLISHED_BOOK]->(b)
        RETURN p,b
      `,
        {bookId, publisherId},
      )
      .then((result) =>
        result.records.map((record) => ({
          publisherId: record.get('p').properties.id,
          bookId: record.get('b').properties.id,
        })),
      )
      .then((entities) => entities[0]);
  }
}
