import { NgModule, Injectable } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
@NgModule({
  imports: [
    CommonModule
  ],
  declarations: []
})
export class MatGroupBy {

  public groupingChange: BehaviorSubject<Grouping>;

  constructor() {
    this.groupingChange = new BehaviorSubject<Grouping>(this.grouping);
  }

  public get grouping(): Grouping { return this._grouping; }
  public set grouping(grouping: Grouping) {
    this._grouping = grouping;
    this.groupingChange.next(this.grouping);
  }
  private _grouping: Grouping;
  private groupCache = new GroupCache<Group>();

  public isGroup(index, item): boolean {
    return item.level;
  }

  public toggleExpanded(row) {
    row.expanded = !row.expanded;
    this.groupingChange.next(this.grouping);
  }

  public groupData<T>(data: T[]): (T | Group)[] {
    let rootGroup = this.getRootGroup();
    if (!rootGroup) {
      rootGroup = new Group();
      this.groupCache.add({}, rootGroup);
    }
    const sortedData = this.grouping.doSort<T>(data);
    return this.getSublevel<T>(sortedData, 0, rootGroup);
  }

  private getSublevel<T>(data: T[], level: number, parent: Group): (T | Group)[] {
    // Recursive function, stop when there are no more levels.
    if (level >= this.grouping.columns.length) {
      return data;
    }

    const currentColumn = this.grouping.columns[level];

    const groups = this.uniqueBy(
      data.map(
        row => {
          const key = {};
          for (let i = 0; i <= level; i++) {
            key[this.grouping.columns[i]] = row[this.grouping.columns[i]];
          }

          let result = this.groupCache.retrieve(key);
          if (!result) {
            result = new Group();
            result.level = level + 1;
            result.parent = parent;
            result.name = currentColumn;
            result.value = row[currentColumn];
            result.key = key;
            this.groupCache.add(key, result);
          }
          return result;
        }
      ),
      JSON.stringify);

    let subGroups = [];
    groups.forEach(group => {
      const rowsInGroup = data.filter(row => group.value === row[currentColumn]);
      subGroups = subGroups.concat([group]);
      if (group.expanded) {
        subGroups = subGroups.concat(
          this.getSublevel<T>(rowsInGroup, level + 1, group)
        );
      }
    });
    return subGroups;
  }

  private uniqueBy(a, key) {
    const seen = {};
    return a.filter(function (item) {
      const k = key(item);
      return seen.hasOwnProperty(k) ? false : (seen[k] = true);
    });
  }

  private getRootGroup(): (Group | null) {
    return this.groupCache.retrieve({});
  }
}

export class GroupCache<T> {

  private cache = {};

  add(key: any, item: T) {
    const keyString = JSON.stringify(key);
    this.cache[keyString] = item;
  }

  retrieve(key: any): T {
    const keyString = JSON.stringify(key);
    return <T>this.cache[keyString];
  }
}

export class Grouping {
  readonly columns: string[];

  constructor(columns: string[]) {
    this.columns = columns;
  }

  doSort<T>(data: T[]) {
    return data.sort(this.compareGroupedColumns.bind(this));
  }

  compareGroupedColumns<T>(a: T, b: T): number {
    for (let columnIndex = 0; columnIndex < this.columns.length; columnIndex++) {
      // Don't use columns.foreach(column => {...});
      // it prevents the return value being passed out of the function.
      const column = this.columns[columnIndex];
      if (a[column] > b[column]) { return +1; }
      if (a[column] < b[column]) { return -1; }
    }
    return 0;
  }
}
export class Group {
  level = 0;
  name: string;
  value: any;
  parent: Group;
  expanded = true;
  key: object;
}
