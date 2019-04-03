import React, { Component } from "react";
import axios from "axios";
import { convertDateToString } from "./helper";
import { Link } from 'react-router-dom';
import jwtDecode from "jwt-decode"; 

export default class TicketList extends Component {
    constructor(props) {
        super(props);
        const {ticket} = this.props.location.state;
        const displayDate = convertDateToString(ticket.dateOfCreation);
        const idToken = jwtDecode(localStorage.getItem("id_token"));
        const email = idToken.email;
        this.state = {
            ticket: ticket, 
            displayDate: displayDate,
            statusUpdates: [],
            attendedBy: email,
        };
        this.routeChange = this.routeChange.bind(this);
    }

    componentWillMount() {
        axios.get('http://localhost:4000/status/ticketid/' + this.state.ticket._id)
            .then((response) => {
                console.log("querying for relevant updates");
                console.log(response);
                if (response.data != null) {
                    this.setState({ 
                        statusUpdates: response.data, 
                    });
                    console.log("updated state");
                    console.log(this.state);
                }
            })
            .catch( (error , response) => {
                console.log(error);
            });
    }

    // Upon confirmation to delete, the ticket will be deleted,
    // a status update will be created, and an email will be sent.
    
    // form modal pop up to be implemented later for inputting comments.
    alert = () => {
        if(window.confirm('Are you sure you want to delete this ticket?')) {
            axios.delete('http://localhost:4000/ticket/delete/' + this.state.ticket._id)
                .then(res => {
                    console.log('deleted' + this.state.ticket._id);

                });

            var update = {
                statusToClient: "Closed",
                statusToAdmin: "Closed",
                ticketId: this.state.ticket._id,
                attendedBy: this.state.attendedBy,
                dateOfUpdate: new Date(),
            }
            
            axios.post('http://localhost:4000/status/add', update)
                .then(res => {
                    console.log("posting status update")
                    console.log(res);
                })
                .catch(err => console.log(err))

            var message = {
                title: "Close Ticket",
                status: "Closed by " + this.state.attendedBy,
                receiver: this.ticket.createdBy,
            }

            axios.post("/api/notify", message)
                .then(res => {
                    console.log('emailed');
                })
              .catch(err => console.log(err))

            this.routeChange();
        }
    }

    routeChange() {
        let path = "/dashboard";
        this.props.history.push(path);
    }

    renderTopics() {
        return this.state.ticket.topics.map((obj, i) => {
            return <span class="badge badge-pill badge-warning mr-2"> {obj} </span>
        });
    }

    render() {
        
        return(
            <div className="container-fluid" >
                <div>
                    <h3> {this.state.ticket.title} </h3>
                    <p> Submitted on: {this.state.displayDate} <span class="badge badge-secondary mr-2"> {this.state.ticket.statusToClient} </span> </p>
                    <div className="d-flex justify-content-center my-2">
                        { this.renderTopics() }          
                    </div>
                    <div className="my-5 mb-2">
                        <h4> Description </h4>
                        <p> {this.state.ticket.description} </p>
                    </div>
                </div>

                {this.state.statusUpdates.map((obj, i) => 
                    <div>
                        <p>Update History</p>
                        <table className="table table-striped text-white">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Attended By</th>
                                    <th>Comments</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                <td>
                                    {obj.dateOfUpdate}
                                </td>
                                <td>
                                    {obj.attendedBy}
                                </td>
                                <td>
                                    {obj.comments}
                                </td>
                                <td>
                                    Some status field to be implemented later.
                                </td>
                            </tbody>
                        </table>
                    </div>
                    )
                }

                <div className="my-2">
                <Link to={"/update/"+this.state.ticket._id} className="btn btn-light">Update Ticket Status</Link>
                <button onClick={this.alert} className="btn btn-danger">Delete Ticket</button>
                </div>
            </div>

        )
    }
}