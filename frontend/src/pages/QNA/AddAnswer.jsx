import { Button } from "@nextui-org/react";

const AddAnswer = () => {
  return (
    <div className="my-10 ">
      <h1 className="mb-4 text-xl">Your Answer</h1>
      <div className="p-4 border rounded-lg bg-gray-200 text-black">
        This will dynamically get a list of all columns that do not start with
        col then it will drop them from the summation aggregation along the
        column axis
      </div>
      <Button color="primary" className="mt-4">
        Post Your Answer
      </Button>
    </div>
  );
};

export default AddAnswer;
