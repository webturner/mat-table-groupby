import { MatTableGroupingModule } from './mat-table-grouping.module';

describe('MatTableGroupingModule', () => {
  let matTableGroupingModule: MatTableGroupingModule;

  beforeEach(() => {
    matTableGroupingModule = new MatTableGroupingModule();
  });

  it('should create an instance', () => {
    expect(matTableGroupingModule).toBeTruthy();
  });
});
