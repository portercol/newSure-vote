// import necessary modules/packages & components
import React, { useState, useEffect } from "react";
import { Button, Container, Col, Row, Card } from "react-bootstrap";
import axios from 'axios';
import ConstAmend1Data from '../seedData/const1';
import { useGlobalContextAuthUser } from "../utils/GlobalContextAuthUser.js";

// create functional component to hold data
const ConstAmend2 = () => {

  // set values for 'useState'
  const [candidateList, setCandidateList] = useState([]);
  const [electionList, setElectionList] = useState([]);
  const [answer, setAnswer] = useState("");
  const [voted, setVoted] = useState(false);
  const [userId] = useGlobalContextAuthUser();

  // pulling data from back end to page
  useEffect(() => {
    axios
      .get('/api/candidate')
      .then((res) => {
        const candidateData = res.data.getCandidate;
        setCandidateList(candidateData);
        // console.log(candidateData)
      })

    axios
      .get('/api/election')
      .then((res) => {
        const electionData = res.data.getElection;
        setElectionList(electionData);
        // console.log(electionData)
      })
  }, []);

  const submitVote = (event) => {
    event.preventDefault();
    if (candidateList && electionList && candidateList.length > 0 && electionList.length > 0) {
      // const selectedCandidate = candidateList.find(currentCandidate => currentCandidate.name === answer)
      const selectedElection = electionList.find(currentElection => currentElection.question === "Constitutional Amendment 2")
      const userVoting = userId.id
      console.log(userVoting);
      axios.post('/api/vote', { election: selectedElection._id, userId: userVoting })
        .then((res) => {
          // console.log(res.data)
          setVoted(true)
          setAnswer()
          setElectionList();
          if (res.data.error) {
            alert(res.data.error);
          } else {
            alert("You voted for " + answer + ".");
          }
        })
        .catch(err => console.log(err));
    }
  };

  return (
    <Container id="const-amend1-card">
      <Card bg="light">
        <Card.Body>
          <h3>Utah State Constitutional Amendment 2</h3>
          <h6>
            Shall the Utah Constitution be amended to specify that certain requirements that a person must meet to be eligible for the office of senator or representative in the Utah Legislature apply at the time the person is elected or appointed?
          </h6>
          <hr />

          <Row>
            <Col xs lg={5}></Col>
            <Col xs lg={1}>
              <form>
                <input
                  type="radio"
                  checked={answer === "yes"}
                  disabled={voted}
                  value="yes"
                  id="answer1"
                  onChange={(e) => {
                    setAnswer(e.target.value);
                  }}
                />
              </form>
            </Col>
            <Col xs lg={1}>
              <p>Yes</p>
            </Col>
            <Col xs lg={5}></Col>
          </Row>

          <Row>
            <Col xs lg={5}></Col>
            <Col xs lg={1}>
              <form>
                <input
                  type="radio"
                  checked={answer === "no"}
                  disabled={voted}
                  value="no"
                  id="answer2"
                  onChange={(e) => {
                    setAnswer(e.target.value);
                  }}
                />
              </form>
            </Col>
            <Col xs lg={1}>
              <p>No</p>
            </Col>
            <Col xs lg={5}></Col>
          </Row>

          <Button
            variant="dark"
            type="submit"
            size="lg"
            block
            disabled={!answer || voted}
            onClick={submitVote}
          >
            Submit
          </Button>
        </Card.Body>
      </Card>
    </Container>
  );
};

// export ConstAmend2 out of ConstAmend2.jsx
export default ConstAmend2;