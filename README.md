# mat-table-groupby

This is a development of the code created in the two stackblitz projects posted in 
https://stackoverflow.com/questions/52217179/angular-material-mat-table-row-grouping/52706931#52706931

I've suggested that it be included in material2/src/lib/table/table-data-source.ts like the sort 
and paginate features (see https://github.com/angular/material2/issues/10660)

This is now implemented in a copy of the MatTableDataSource class. It plays nicely with the 
existing filter and sort features, but not quite as nicely with the paginate feature because they 
are serving a similar purpose.

The pagination occurs before the grouping. This means that only groups revelant to the page are 
displayed (though at least one from each level). However, if all the rows on a page fall into one 
group and that group is collapsed then you will see no rows on the page. If there are many pages 
rows in this collapsed group then you will need to page through them all to see the next data row.