type BookingFormProps = {
  event: {
    id: string;
    title: string;
    description: string;
    duration: number;
    userId: string;
    isPrivate: boolean;
    createdAt: Date;
    updatedAt: Date;
    user: {
      name: string;
      email: string;
      imageUrl?: string;
      username: string;
    };
  };
  availability: {
    date: string;
    slots: string[];
  }[];
};

const BookingForm = ({ event, availability }: BookingFormProps) => {
  console.log(event, availability);
  return <div>BookingForm</div>;
};

export default BookingForm;
