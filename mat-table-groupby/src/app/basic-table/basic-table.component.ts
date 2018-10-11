import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material';

import { People, SampleDataService } from "../sample-data.service";
import { MatTableGroupingModule } from "../mat-table-grouping/mat-table-grouping.module"

@Component({
  selector: 'app-basic-table',
  templateUrl: './basic-table.component.html',
  styleUrls: ['./basic-table.component.css']
})
export class BasicTableComponent implements OnInit {

  displayedColumns: string[] = ['surname', 'forename', 'gender', 'ukCity', 'salary', 'department'];

  grouping = new MatTableGroupingModule<People>();

  constructor(private sampleDataService: SampleDataService) { }

  ngOnInit() {
    this.grouping.init(['department', 'salary'], this.sampleDataService.people);
  }

}
