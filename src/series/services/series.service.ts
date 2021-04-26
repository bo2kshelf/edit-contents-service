import {Injectable} from '@nestjs/common';
import {IDService} from '../../common/id/id.service';
import {Neo4jService} from '../../neo4j/neo4j.service';
import {SeriesEntity} from '../entities/series.entity';

@Injectable()
export class SeriesService {
  constructor(
    private readonly neo4jService: Neo4jService,
    private readonly idService: IDService,
  ) {}

  async createSeries(
    bookId: string,
    data: {title: string},
  ): Promise<SeriesEntity> {
    const result = await this.neo4jService.write(
      `
        MATCH (b:Book {id: $bookId})
        CREATE (s:Series) SET s += $data
        CREATE (s)-[:HEAD_OF_SERIES]->(b)
        RETURN b.id AS b, s.id AS s
        `,
      {bookId, data: {id: this.idService.generate(), ...data}},
    );
    if (result.records.length === 0) throw new Error('Not Found');
    return {id: result.records[0].get('s')};
  }

  async connectBooksAsNextBook({
    previousId,
    nextId,
  }: {
    previousId: string;
    nextId: string;
  }): Promise<{
    previousId: string;
    nextId: string;
  }> {
    if (previousId === nextId)
      throw new Error("Can't connect between the same books");

    const result = await this.neo4jService.write(
      `
        MATCH (p:Book {id: $previousId}), (n:Book {id: $nextId})
        MERGE (p)-[:NEXT_BOOK]->(n)
        RETURN p.id AS p, n.id AS n
        `,
      {previousId, nextId},
    );
    if (result.records.length === 0) throw new Error('Not Found');
    return {
      previousId: result.records[0].get('p'),
      nextId: result.records[0].get('n'),
    };
  }
}
