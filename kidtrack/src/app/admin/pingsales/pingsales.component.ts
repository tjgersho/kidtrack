import { Component, OnInit } from '@angular/core';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { UserService } from '../../services/user.service';
import { GlobalService } from '../../services/global.service';


@Component({
  selector: 'app-pingsales',
  templateUrl: './pingsales.component.html',
  styleUrls: ['./pingsales.component.css']
})
export class PingsalesComponent implements OnInit {

 transactions: object[] = [];

  constructor(private http: Http, private user: UserService, private global: GlobalService) { }

  ngOnInit() {
	this.getTransactions();
  }

 

 getTransactions(){

        let headers = new Headers({ 'Content-Type': 'application/json', Auth: this.user.token});
        let options = new RequestOptions({ headers: headers });


	this.http.get('/api/v1/admin/pingsales', options).subscribe((resp) => {
		console.log('Response for ping sales..');
		console.log(resp);
		console.log(resp.json());
		this.transactions = resp.json();


	}, (err) => {
		console.log('Error getting comments');
		console.log(err);
	
	}, () =>{});

  }



  archiveTransaction(id: number){

	console.log('Delete Transaction');
	console.log(id);

        let headers = new Headers({ 'Content-Type': 'application/json', Auth: this.user.token});
        let options = new RequestOptions({ headers: headers });

	this.http.delete('/api/v1/admin/pingsales/'+ id, options).subscribe((resp) => {
		console.log('Response from deleting admin transaction');
		console.log(resp);
		console.log(resp.json());
		this.getTransactions();


	}, (err) => {
		console.log('Error getting comments');
		console.log(err);
	
	}, () =>{});


   }


}
