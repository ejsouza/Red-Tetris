import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';

const WaitHostButton = (props: { msg: string }): JSX.Element => {
  return (
    <>
      <Button variant="outline-secondary" disabled>
        <Spinner
          as="span"
          animation="grow"
          size="sm"
          role="status"
          aria-hidden="true"
        />
        {props.msg}
      </Button>
    </>
  );
};

export default WaitHostButton;
