import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from "../../lib/table-data-source";
import { MatGroupBy } from '../../lib/groupBy';

import { People, SampleDataService } from "../sample-data.service";

@Component({
  selector: 'app-basic-table',
  templateUrl: './basic-table.component.html',
  styleUrls: ['./basic-table.component.css']
})
export class BasicTableComponent implements OnInit {

  displayedColumns: string[] = ['surname', 'forename', 'gender', 'ukCity', 'salary', 'department'];

  dataSource = new MatTableDataSource<People>();

  constructor(private sampleDataService: SampleDataService,
    private matGroupBy: MatGroupBy,
    ) { }

  ngOnInit() {
    this.dataSource.groupBy = this.matGroupBy;
    this.dataSource.data = this.sampleDataService.people;
    this.matGroupBy.grouping = { groupedColumns: ['department', 'salary'] };
  }
}
