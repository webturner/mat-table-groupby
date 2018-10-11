import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource } from '@angular/material';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: []
})
export class MatTableGroupingModule<T> {

  public groupByColumns: string[] = [];
  public dataSource = new MatTableDataSource<T | Group>([]);

  public init(groupByColumns, data) {
    this.groupByColumns = groupByColumns;
    this.dataSource.data = this.addGroups(data);
    this.dataSource.filterPredicate = this.customFilterPredicate.bind(this);
  }

  public customFilterPredicate(data: T | Group, filter: string): boolean {
    return (data instanceof Group) ? data.visible : this.getDataRowVisible(data);
  }

  public addGroups(data: any[]): any[] {
    var rootGroup = new Group();
    return this.getSublevel(data, 0, rootGroup);
  }

  getDataRowVisible(data: T): boolean {
    const groupRows = this.dataSource.data.filter(
      row => {
        if (!(row instanceof Group)) return false;

        let match = true;
        this.groupByColumns.forEach(
          column => {
            if (!row[column] || !data[column] || row[column] !== data[column]) match = false;
          }
        );
        return match;
      }
    );

    if (groupRows.length === 0) return true;
    if (groupRows.length > 1) throw "Data row is in more than one group!";
    const parent = <Group>groupRows[0];

    return parent.visible && parent.expanded;
  }

  groupHeaderClick(row) {
    row.expanded = !row.expanded
    this.dataSource.filter = performance.now().toString();  // hack to trigger filter refresh
  }

  getSublevel(data: any[], level: number, parent: Group): any[] {
    // Recursive function, stop when there are no more levels. 
    if (level >= this.groupByColumns.length)
      return data;

    var groups = this.uniqueBy(
      data.map(
        row => {
          var result = new Group();
          result.level = level + 1;
          result.parent = parent;
          for (var i = 0; i <= level; i++)
            result[this.groupByColumns[i]] = row[this.groupByColumns[i]];
          return result;
        }
      ),
      JSON.stringify);

    const currentColumn = this.groupByColumns[level];

    var subGroups = [];
    groups.forEach(group => {
      let rowsInGroup = data.filter(row => group[currentColumn] === row[currentColumn])
      let subGroup = this.getSublevel(rowsInGroup, level + 1, group);
      subGroup.unshift(group);
      subGroups = subGroups.concat(subGroup);
    })
    return subGroups;
  }

  uniqueBy(a, key) {
    var seen = {};
    return a.filter(function (item) {
      var k = key(item);
      return seen.hasOwnProperty(k) ? false : (seen[k] = true);
    })
  }

  isGroup(index, item): boolean {
    return item.level;
  }

}

export class Group {
  level: number = 0;
  parent: Group;
  expanded: boolean = true;
  get visible(): boolean {
    return !this.parent || (this.parent.visible && this.parent.expanded);
  }
}
