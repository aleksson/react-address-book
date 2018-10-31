import axios from 'axios';
import ApiSettings from './config';
import React, { Component } from 'react';
import Modal from 'react-bootstrap-modal';
import { BootstrapTable, TableHeaderColumn, SearchField } from 'react-bootstrap-table';

export default class EmployeeTable extends Component {
    constructor(props){
        super(props);
        
        const { endpoint , total } = ApiSettings;

        this.state = {
            open : false,
            employees : [],
            selected : null,
            api : endpoint,
            totals : total
        };
    };
    
    componentDidMount() {
        try{ 
            this.fetchDataFromAPI();
        } catch(error){
            console.warn('Got error while loading employees... : ' , { error });
        }
    }

    componentWillUpdate(oldProps, newProps){
        
        // Update employee list if we got some new data
        if(this.state.employees !== newProps.employees){
            this.setState({ employees : newProps.employees });
        }
        // Hide the loading screen
        document.getElementById('loadingScreen').style.display = 'none';

        if(window.outerWidth < 996){
            var input = document.getElementsByClassName('employee--search--field');
            input[0].parentNode.offsetParent.className = "col-xs-12";    
        }
    };

    fetchDataFromAPI = () =>{

        const { api , totals } = this.state;

        // Grab some random key value from user
        // we can then rerender with the new 
        // set of employees if provided 
        
        let hasItems = false;
        // ex http://localhost:[PORT]/whatever = number
        let itemsToLoad = window.location.pathname.split('/').pop().split('=').pop();
    
        if(itemsToLoad) hasItems = true;
        let counts = ( hasItems && itemsToLoad >= 1 ? itemsToLoad : totals);

        // Get some Employee data from Randomuser's API with axios
        axios.get(api + counts).then(res => {
            // Check for request success and data
            if(res.data && res.status === 200){
                // Save result to state as contacts
                if(res.data.results) this.setState({ employees : res.data.results });   
            }
        });
    }

    render() {

        // Some set of action handlers 

        const closeModal = () => {
            this.setState({ open: false, selected: null });
        }

        const showEmployeeDetails = (employee) => {
            this.setState({ open : true, selected : employee });
        }

        const hasSelectedEmployee = (employeeDetail) => {
            let selected = this.state.selected;
            return (selected != null && selected[employeeDetail] ? true : false);
        }

        const searchfield = (props) => {
            return (<SearchField  className={'employee--search--field'} placeholder={'Search by Name, Number, City etc.'} />);
        }
        
        const tableOptions = {
            clearSearch: true,
            searchField : searchfield,
            onRowClick: function(employee){
                return showEmployeeDetails(employee);
            },
            profileImage : (cell, row) => {
                return (<img  src={row.picture} className={'img-responsivse rounded'} alt={'profile'} />)
            }
        }
        
        let employeeName = hasSelectedEmployee('name') ? this.state.selected.name : '';
        let employeePhone = hasSelectedEmployee('phone') ? this.state.selected.phone : '';
        let employeeEmail = hasSelectedEmployee('email') ? this.state.selected.email.replace('@example.com','@additude.se') : '';
        let employeeImage = hasSelectedEmployee('pics') ? this.state.selected.pics.large : '';
        let employeeBithday = hasSelectedEmployee('dob') ? new Date(this.state.selected.dob.date).toDateString() : '';
        let employeeLocation = hasSelectedEmployee('ref') ? this.state.selected.nat + ', ' + this.state.selected.street  : '';
        
        // Here we create a new contact object from orginal api result
        // we do this so it can be properly used by table component  

        let allContacts = this.state.employees;        
        let formatedList = allContacts.map((c,k) => {
            let employee = Object.assign({},{
                name    : c['name'].first.toUpperCase() +" "+ c['name'].last.toUpperCase(),
                email   : c['email'].replace('@example.com','@additude.se'),
                city    : c['location'].city.toUpperCase(),
                street  : c['location'].street,
                picture : c['picture'].medium,
                pics    : c['picture'],
                age     : c['dob'].age,
                phone   : c['cell'],
                dob     : c['dob'],
                nat     : c['nat'],
                id      : c.id,
                ref     : c
            });
            return employee;
        });

        // Here we render the complete table and modal component along 
        // with the formated employee data we have stored in the state
        
        return(
            <div>
                <BootstrapTable data={formatedList} search options={tableOptions} bordered={false} pagination> 
                    <TableHeaderColumn dataField='image' dataFormat={tableOptions.profileImage} alt={'profile'}>Profile</TableHeaderColumn>
                    <TableHeaderColumn dataField='name' dataSort={true}>Name</TableHeaderColumn>
                    <TableHeaderColumn dataField='email' dataSort={true} isKey={true}>Email</TableHeaderColumn>
                    <TableHeaderColumn dataField='phone' dataSort={true}>Phone</TableHeaderColumn>
                    <TableHeaderColumn dataField='city' dataSort={true}>City</TableHeaderColumn>
                </BootstrapTable>

                <Modal show={this.state.open} onHide={closeModal}>
                    <Modal.Header closeButton>
                        <Modal.Title> Employee:<b> { employeeName } </b>  </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div>
                            <div>
                                <img src={ employeeImage } className={'profile--image img-responsive pull-left'} alt={'profile'}  />
                            </div>

                            <div>
                                Phone : <b>{ employeePhone }</b><br/>
                                Email : <a>{ employeeEmail }</a><br/>
                                Location : { employeeLocation }<br/>
                                Birthday : { employeeBithday }<br/>
                                <a href={'mailto:'+ employeeEmail +'?Subject=New%20Contact%20From%20App'}>
                                    <button className={'btn btn-default'}>Contact { employeeName } </button>
                                </a> 
                            </div>
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