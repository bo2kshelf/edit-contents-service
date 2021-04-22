import {INestApplication} from '@nestjs/common';
import {Test} from '@nestjs/testing';
import * as faker from 'faker';
import {IDModule} from '../../../../common/id/id.module';
import {IDService} from '../../../../common/id/id.service';
import {Neo4jTestModule} from '../../../../neo4j/neo4j-test.module';
import {Neo4jService} from '../../../../neo4j/neo4j.service';
import {LabelsService} from '../../labels.service';

describe(LabelsService.name, () => {
  let app: INestApplication;

  let neo4jService: Neo4jService;
  let idService: IDService;

  let labelsService: LabelsService;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [Neo4jTestModule, IDModule],
      providers: [IDService, LabelsService],
    }).compile();

    app = module.createNestApplication();
    await app.init();

    neo4jService = module.get<Neo4jService>(Neo4jService);
    idService = module.get<IDService>(IDService);

    labelsService = module.get<LabelsService>(LabelsService);
  });

  beforeEach(async () => {
    jest.clearAllMocks();
    await neo4jService.write(`MATCH (n) DETACH DELETE n`);
  });

  afterAll(async () => {
    await app.close();
  });

  it('to be defined', () => {
    expect(labelsService).toBeDefined();
  });

  describe('create()', () => {
    it('publishedIdに対してpublisherが存在しない場合例外を投げる', async () => {
      await expect(() =>
        labelsService.create({name: 'A', publisherId: '1'}),
      ).rejects.toThrow(/Publisher Not Found/);
    });

    describe('publisherが存在する場合)', () => {
      const expectedPublisher = {id: '1'};
      beforeEach(async () => {
        await neo4jService.write(
          `CREATE (p:Publisher) SET p=$publisher RETURN p`,
          {publisher: expectedPublisher},
        );
      });

      it.each([[{name: 'A', publisherId: expectedPublisher.id}]])(
        '生成に成功する %#',
        async (data) => {
          const actual = await labelsService.create(data);

          expect(actual).toStrictEqual(expect.any(String));
        },
      );
    });
  });

  describe('labeledBook()', () => {
    const expectedLabel = {id: 'label1', name: faker.lorem.words(2)};
    const expectedBook = {id: 'book1', title: faker.lorem.words(2)};

    beforeEach(async () => {
      await neo4jService.write(`CREATE (n:Label) SET n=$expected RETURN *`, {
        expected: expectedLabel,
      });
      await neo4jService.write(`CREATE (n:Book) SET n=$expected RETURN *`, {
        expected: expectedBook,
      });
    });

    it('正常な動作', async () => {
      const actual = await labelsService.labeledBook({
        labelId: expectedLabel.id,
        bookId: expectedBook.id,
      });

      expect(actual.labelId).toBe(expectedLabel.id);
      expect(actual.bookId).toBe(expectedBook.id);

      const neo4jResult = await neo4jService.read(
        `MATCH (:Label {id: $publisherId})-[r: LABELED_BOOK]->(:Book {id: $bookId}) RETURN r`,
        {bookId: expectedBook.id, publisherId: expectedLabel.id},
      );
      expect(neo4jResult.records).toHaveLength(1);
    });

    it('2回同じ操作をすると上書き', async () => {
      const once = await labelsService.labeledBook({
        labelId: expectedLabel.id,
        bookId: expectedBook.id,
      });
      const two = await labelsService.labeledBook({
        labelId: expectedLabel.id,
        bookId: expectedBook.id,
      });

      expect(once.labelId).toBe(expectedLabel.id);
      expect(once.bookId).toBe(expectedBook.id);

      expect(two.labelId).toBe(expectedLabel.id);
      expect(two.bookId).toBe(expectedBook.id);

      const neo4jResult = await neo4jService.read(
        `MATCH (:Label {id: $publisherId})-[r: LABELED_BOOK]->(:Book {id: $bookId}) RETURN r`,
        {bookId: expectedBook.id, publisherId: expectedLabel.id},
      );
      expect(neo4jResult.records).toHaveLength(1);
    });
  });
});
