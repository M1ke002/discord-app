import { redirect } from 'next/navigation';

//the home page
const SetupPage = () => {
  return redirect('/conversations');
};

export default SetupPage;
