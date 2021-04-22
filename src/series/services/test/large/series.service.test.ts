import {INestApplication} from '@nestjs/common';
import {Test} from '@nestjs/testing';
import {IDModule} from '../../../../common/id/id.module';
import {IDService} from '../../../../common/id/id.service';
import {Neo4jTestModule} from '../../../../neo4j/neo4j-test.module';
import {Neo4jService} from '../../../../neo4j/neo4j.service';
import {SeriesService} from '../../series.service';

describe(SeriesService.name, () => {
  let app: INestApplication;

  let neo4jService: Neo4jService;
  let seriesService: SeriesService;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [Neo4jTestModule, IDModule],
      providers: [IDService, SeriesService],
    }).compile();

    app = module.createNestApplication();
    await app.init();

    neo4jService = module.get<Neo4jService>(Neo4jService);
    seriesService = module.get<SeriesService>(SeriesService);
  });

  beforeEach(async () => {
    jest.clearAllMocks();
    await neo4jService.write(`MATCH (n) DETACH DELETE n`);
  });

  afterAll(async () => {
    await app.close();
  });

  it('to be defined', () => {
    expect(seriesService).toBeDefined();
  });

  describe('create()', () => {
    it('正常に生成する', async () => {
      await neo4jService.write(
        `
        CREATE (b:Book {id: "book1"})
        RETURN *
        `,
      );
      const actual = await seriesService.createSeries('book1', {
        title: 'series',
      });
      expect(actual).toBe(expect.any(String));
    });

    it('bookが存在しない場合例外を投げる', async () => {
      await expect(() =>
        seriesService.createSeries('book2', {title: 'series'}),
      ).rejects.toThrow(/Not Found/);
    });
  });

  describe('connectBooksAsNextBook()', () => {
    it('正常に生成する', async () => {
      await neo4jService.write(
        `
        CREATE (p:Book {id: "pre"})
        CREATE (n:Book {id: "next"})
        RETURN *
        `,
      );
      const actual = await seriesService.connectBooksAsNextBook({
        previousId: 'pre',
        nextId: 'next',
      });
      expect(actual.previousId).toBe('pre');
      expect(actual.nextId).toBe('next');
    });

    it('previousIdに紐づくbookが存在しない場合例外を投げる', async () => {
      await neo4jService.write(
        `
        CREATE (n:Book {id: "next"})
        RETURN *
        `,
      );
      await expect(() =>
        seriesService.connectBooksAsNextBook({
          previousId: 'pre',
          nextId: 'next',
        }),
      ).rejects.toThrow(/Not Found/);
    });

    it('nextIdに紐づくbookが存在しない場合例外を投げる', async () => {
      await neo4jService.write(
        `
        CREATE (p:Book {id: "pre"})
        RETURN *
        `,
      );
      await expect(() =>
        seriesService.connectBooksAsNextBook({
          previousId: 'pre',
          nextId: 'next',
        }),
      ).rejects.toThrow(/Not Found/);
    });
  });
});
