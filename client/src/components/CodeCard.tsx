import React from "react";
import { Button, Card } from "reactstrap";

interface CodeCardProps {
  photoUrl: string;
  codeText: string;
  codeTitle: string;
}

export default function CodeCard(props: CodeCardProps) {
  return (
    <Card className="">
      <div className="card-top">
        <img src={props.photoUrl} alt="Card Photo" className="card-photo" />
      </div>
      <div className="card-bottom">
        <div className="card-text">{props.codeTitle}</div>
      </div>

      <div className="card-buttons d-flex">
        <Button color="primary">Edit</Button>
        <Button color="primary">Edit</Button>
        <Button color="primary">Edit</Button>
        <Button color="primary">Edit</Button>
      </div>
    </Card>
  );
}
