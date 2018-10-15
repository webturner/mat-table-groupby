# MatTableGroupby

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 6.0.8.


# Grouping and pagination

Both grouping and pagination serve a similar purpose, they hide redundant rows so the user can see 
a smaller view of the data, both for speed and information overload purposes. Because of this 
shared purpose they somewhat conflict. 

See (https://ux.stackexchange.com/questions/23529/what-is-the-expected-paging-behavior-of-a-tree)


First option is paginate then group, this will take a page of data from the set and apply grouping 
at that level

* Pro: Group headers back to root are shown from the top of the page

* Con: Group headers add to the number of rows displayed, each page could be a different size 
depending on how many groups it included

* Pro: The count in the ui's paginator shows the correct number of records in the data

* Con: Collapse a group on page one it remains collapsed on others, if you have a group that is 
much bigger than the page you may need to move hrough many paged to see the next data row.


Second option is group then paginate, this will group the data then slice pages out of the groups.

* Pro: Page size is always the same, be they data or group rows.

* Con: The count of rows includes any groups added by the system.

* Pro: Collapse a group and the next group is pulled in below it as long as there is space on the 
page. 

* Con: The first row may be a data row from a group on an earlier page. 

* Con: The row count changes as you expand and collapse rows. 

* Con: If the user loads partial data i.e. they load the first 3 pages ofdtat from the server, then
when the user goes to page 4 and the system downloads more data the rows may be added to groups 
that aren't on the screen. (However, the data should have been sorted properly first.)



