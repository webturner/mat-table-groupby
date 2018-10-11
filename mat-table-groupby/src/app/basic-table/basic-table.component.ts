import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material';

import { People, SampleDataService } from "../sample-data.service";

@Component({
  selector: 'app-basic-table',
  templateUrl: './basic-table.component.html',
  styleUrls: ['./basic-table.component.css']
})
export class BasicTableComponent implements OnInit {

  displayedColumns: string[] = ['surname', 'forename', 'gender', 'ukCity', 'salary', 'department'];
  public dataSource = new MatTableDataSource<People>([]);

  constructor(private sampleDataService: SampleDataService) { }

  ngOnInit() {
    this.dataSource.data = this.sampleDataService.people;
  }

}
