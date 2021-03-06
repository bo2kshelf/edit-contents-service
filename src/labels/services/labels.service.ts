import {Injectable} from '@nestjs/common';
import {IDService} from '../../common/id/id.service';
import {Neo4jService} from '../../neo4j/neo4j.service';
import {LabelEntity} from '../entities/label.entity';
import {LabelingEntity} from '../entities/labeling.entity';

@Injectable()
export class LabelsService {
  constructor(
    private readonly neo4jService: Neo4jService,
    private readonly idService: IDService,
  ) {}

  async create({
    publisherId,
    ...data
  }: {
    name: string;
    publisherId: string;
  }): Promise<LabelEntity> {
    const publisher = await this.neo4jService.write(
      `MATCH (p:Publisher {id: $publisherId}) RETURN p.id AS p`,
      {publisherId},
    );
    if (publisher.records.length === 0) throw new Error('Publisher Not Found');
    const result = await this.neo4jService.write(
      `
      MATCH (p:Publisher {id: $publisherId})
      CREATE (l:Label {id: $id}) SET l += $data
      CREATE (p)-[:HAS_LABEL]->(l)
      RETURN l.id AS l
      `,
      {id: this.idService.generate(), publisherId, data},
    );
    return {id: result.records[0].get('l')};
  }

  async labeledBook({
    bookId,
    labelId,
  }: {
    labelId: string;
    bookId: string;
  }): Promise<LabelingEntity> {
    return this.neo4jService
      .write(
        `
        MATCH (l:Label {id: $labelId}), (b:Book {id: $bookId})
        MERGE (l)-[:LABELED_BOOK]->(b)
        RETURN l.id AS l, b.id AS b
      `,
        {bookId, labelId},
      )
      .then((result) =>
        result.records.map((record) => ({
          labelId: record.get('l'),
          bookId: record.get('b'),
        })),
      )
      .then((entities) => entities[0]);
  }
}
