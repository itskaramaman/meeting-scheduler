import { eventSchema } from "@/lib/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

type EventFormProps = {
  onSubmitForm: () => void;
};

const EventForm = ({ onSubmitForm }: EventFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      duration: 30,
      isPrivate: true,
    },
  });
  
  return <form>EventForm</form>;
};

export default EventForm;
