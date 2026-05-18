import { useSearchParams}  from "react-router-dom";

const Stripe = () => {
    const [SearchParams]=useSearchParams() ;
    const plan = SearchParams.get('plan');
    //----------------------------------------

    return <>
        <main >
            <h1>{`Stripe_Page_Soon/${plan}`}</h1>
        </main>
    </>
} ;
export default Stripe ;