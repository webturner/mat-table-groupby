import { NgModule, IterableDiffers, IterableDiffer, DoCheck, Injectable } from '@angular/core';
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
export class MatGroupBy implements DoCheck {

  groupingDiffer: IterableDiffer<string>;
  groupingChange: BehaviorSubject<Grouping>;

  constructor(private _iterableDiffers: IterableDiffers) {
    this.groupingChange = new BehaviorSubject<Grouping>(this.grouping);
    this.groupingDiffer = this._iterableDiffers.find([]).create(null);
  }

  ngDoCheck() {
    let changes = this.groupingDiffer.diff(this.grouping.groupedColumns);
    if (changes) {
      this.groupingChange.next(this.grouping);
    }
  }

  get grouping(): Grouping { return this._grouping; }
  set grouping(grouping: Grouping) {
    this._grouping = grouping;
    this.groupingChange.next(this.grouping);
  }
  private _grouping: Grouping = { groupedColumns: [] };

  public isGroup(index, item): boolean {
    return item.level;
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

    var groups = this.uniqueBy(
      data.map(
        row => {
          var result = this.getDataGroup(row, level + 1);
          if (!result) {
            result = new Group();
            result.level = level + 1;
            result.parent = parent;
            for (var i = 0; i <= level; i++)
              result[this.grouping.groupedColumns[i]] = row[this.grouping.groupedColumns[i]];
            this.groupCache.push(result);
          }
          return result;
        }
      ),
      JSON.stringify);

    const currentColumn = this.grouping.groupedColumns[level];

    var subGroups = [];
    groups.forEach(group => {
      let rowsInGroup = data.filter(row => group[currentColumn] === row[currentColumn]);
      let subGroup = this.getSublevel<T>(rowsInGroup, level + 1, group);
      subGroup.unshift(group);
      subGroups = subGroups.concat(subGroup);
    });
    return subGroups;
  }

  uniqueBy(a, key) {
    var seen = {};
    return a.filter(function (item) {
      var k = key(item);
      return seen.hasOwnProperty(k) ? false : (seen[k] = true);
    });
  }

  public toggleExpanded(row) {
    row.expanded = !row.expanded;
    this.groupingChange.next(this.grouping);
  }

  groupCache: Group[] = [];

  getRootGroup(): (Group | null) {
    const groups = this.groupCache.filter(group => group.level === 0);
    if (groups.length > 1) throw "More than one root group found";
    return groups.length === 1 ? groups[0] : null;
  }

  getDataGroup<T>(data: T, level?: number): (Group | null) {
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
  parent: Group;
  expanded: boolean = true;
  get visible(): boolean {
    return !this.parent || (this.parent.visible && this.parent.expanded);
  }
}
