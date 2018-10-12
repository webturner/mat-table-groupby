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
  private _grouping: Grouping = { groupedColumns: [] };

  public isGroup(index, item): boolean {
    return item.level;
  }

  public toggleExpanded(row) {
    row.expanded = !row.expanded;
    this.groupingChange.next(this.grouping);
  }

  public groupData<T>(data: T[]): (T | Group)[] {
    var rootGroup = this.getRootGroup();
    if (!rootGroup) {
      rootGroup = new Group();
      this.groupCache.push(rootGroup);
    }
    return this.getSublevel<T>(data, 0, rootGroup);
  }

  private getSublevel<T>(data: T[], level: number, parent: Group): (T | Group)[] {
    // Recursive function, stop when there are no more levels. 
    if (level >= this.grouping.groupedColumns.length)
      return data;

    const currentColumn = this.grouping.groupedColumns[level];

    var groups = this.uniqueBy(
      data.map(
        row => {
          var result = this.getDataGroup(row, level + 1);
          if (!result) {
            result = new Group();
            result.level = level + 1;
            result.parent = parent;
            result.name = currentColumn;
            result.value = row[currentColumn];
            for (var i = 0; i <= level; i++)
              result[this.grouping.groupedColumns[i]] = row[this.grouping.groupedColumns[i]];
            this.groupCache.push(result);
          }
          return result;
        }
      ),
      JSON.stringify);

    var subGroups = [];
    groups.forEach(group => {
      let rowsInGroup = data.filter(row => group[currentColumn] === row[currentColumn]);
      subGroups = subGroups.concat([group]);
      if (group.expanded)
        subGroups = subGroups.concat(
          this.getSublevel<T>(rowsInGroup, level + 1, group)
        );
    });
    return subGroups;
  }

  private uniqueBy(a, key) {
    var seen = {};
    return a.filter(function (item) {
      var k = key(item);
      return seen.hasOwnProperty(k) ? false : (seen[k] = true);
    });
  }

  private groupCache: Group[] = [];

  private getRootGroup(): (Group | null) {
    const groups = this.groupCache.filter(group => group.level === 0);
    if (groups.length > 1) throw "More than one root group found";
    return groups.length === 1 ? groups[0] : null;
  }

  private getDataGroup<T>(data: T, level?: number): (Group | null) {
    if (!level) level = this.grouping.groupedColumns.length;
    const groups = this.groupCache.filter(group => {
      if (group.level !== level) return false;

      let match = true;
      for (var i = 0; i < level; i++) {
        const column = this.grouping.groupedColumns[i];
        if (!group[column] || !data[column] || group[column] !== data[column]) match = false;
      }
      return match;
    });

    if (groups.length > 1) throw "More than one group found";
    return groups.length === 1 ? groups[0] : null;
  }
}

export interface Grouping {
  readonly groupedColumns: string[];
}

export class Group {
  level: number = 0;
  name: string;
  value: any;
  parent: Group;
  expanded: boolean = true;
}
