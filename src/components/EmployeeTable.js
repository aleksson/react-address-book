import axios from 'axios';
import React, { Component } from 'react';
import Modal from 'react-bootstrap-modal';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';

export default class EmployeeTable extends Component {
    constructor(props){
        super(props);

        this.state = {
            open : false,
            employees : [],
            selected : null
        };
    };

    componentDidMount() {
        try{ // Get Contact data
            axios.get('https://randomuser.me/api/?results=100').then(res => {
                // Check for request success and verify response data
                if(res.data && res.status === 200){
                    // Save result to state as contacts
                    if(res.data.results) this.setState({ employees : res.data.results });   
                }
            });
        } catch(error){
            console.warn('Got error while loading employees... : ' , { error });
        }    
    }

    componentWillUpdate(oldProps, newProps){

        // Update contact list if we got some other data
        if(this.state.employees !== newProps.employees){
            this.setState({ employees : newProps.employees });
        }
        // Hide the loading screen
        document.getElementById('loadingScreen').style.display = 'none';
    }

    render() {

        const closeModal = () =>{
            this.setState({ open: false, selected : null });
        }

        const showEmployeeDetails = (employee) => {
            this.setState({ open : true, selected : employee });
        }

        const selectedEmployee = () =>{
            if(this.state.selected != null) return true
            else return false
        }
        
        // Here we create a new contact object from orginal api results
        // we do this so it can be properly used by table component  

        let allContacts = this.state.employees;        
        let formatedList = allContacts.map((c,k) => {
            let contact = Object.assign({},{
                name    : c['name'].first.toUpperCase() +", "+ c['name'].last.toUpperCase(),
                city    : c['location'].city.toUpperCase(),
                street  : c['location'].street,
                picture : c['picture'].medium,
                pics    : c['picture'],
                age     : c['dob'].age,
                email   : c['email'],
                phone   : c['cell'],
                dob     : c['dob'],
                nat     : c['nat'],
                id      : c.id,
                ref     : c
            });
            return contact;
        });

        let employeeName = selectedEmployee() ? this.state.selected.name : '';
        let employeePhone = selectedEmployee() ? this.state.selected.phone : '';
        let employeeEmail = selectedEmployee() ? this.state.selected.email : '';
        let employeeImage = selectedEmployee()  ? this.state.selected.pics.large : '';
        let employeeBithday = selectedEmployee()  ? new Date(this.state.selected.dob.date).toDateString() : '';
        let employeeLocation = selectedEmployee()  ? this.state.selected.nat + ', ' + this.state.selected.street  : '';

        const tableOptions = {
            clearSearch: true,
            onRowClick: function(employee){
                return showEmployeeDetails(employee);
            },
            profileImage : (cell, row) => {
                return (<img style={{width:50}} src={row.picture} className="img-responsive rounded" alt={'profile'} />)
            }
        };

        // Here we render the complete table and modal component along 
        // with the employee data we have stored in the state
        
        return(
            <div>
                <BootstrapTable data={formatedList} search={true} options={tableOptions} bordered={false} searchPlaceholder='Search by Name, Number, City etc.' pagination> 
                    <TableHeaderColumn dataField='image' dataFormat={tableOptions.profileImage} alt={'profile'} >Profile</TableHeaderColumn>
                    <TableHeaderColumn width='200' dataField='name' dataSort={true}>Name</TableHeaderColumn>
                    <TableHeaderColumn dataField='email' dataSort={true} isKey={true}>Email</TableHeaderColumn>
                    <TableHeaderColumn dataField='phone' dataSort={true}>Phone</TableHeaderColumn>
                    <TableHeaderColumn dataField='city' dataSort={true}>City</TableHeaderColumn>
                </BootstrapTable>

                <Modal show={this.state.open} onHide={closeModal}>
                    <Modal.Header closeButton>
                        <Modal.Title> Employee:<b> { employeeName } </b>  </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <img src={ employeeImage } alt={'profile'} />
                        <div className="pull-right">
                            Phone : <b>{ employeePhone }</b><br/>
                            Email : <a>{employeeEmail }</a><br/>
                            Location : { employeeLocation }<br/>
                            Birthday : { employeeBithday }<br/><br/>
                            <a href={'mailto:'+ employeeEmail +'?Subject=New%20Contact'}>Contact { employeeName }</a>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Modal.Dismiss className='btn btn-default'>Close</Modal.Dismiss>
                    </Modal.Footer>
                </Modal>
          </div>
        )
    }
}