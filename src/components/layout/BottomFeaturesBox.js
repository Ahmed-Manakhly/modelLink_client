import classes from "./BottomFeaturesBox.module.scss"
import { GrFormNextLink } from "react-icons/gr";
import { GrFormPreviousLink } from "react-icons/gr";


const BottomFeaturesBox = ({ pagination, handlePageNumberChange, handlePageNext, handlePagePrevious ,mainSite=false , footerMsg}) => {
    const pages = Array.from({ length: pagination?.total_pages || 0 }, (_, i) => i + 1);
    if (!pagination || pages.length === 0) return null;
    return (
        <section className={`${classes["bottom-features-box"]} ${mainSite && classes["main-site"]}`} dir="ltr">
            <p className={classes["page-data-count"]}>{footerMsg}{" "}{pagination?.page_data_count}</p>
            <button className={classes["previous-handler"]} onClick={handlePagePrevious} disabled={!pagination?.prev_page} aria-label="Previous Page">
                <GrFormPreviousLink className={classes["prev-icon"]} />
            </button>
            <div className={classes["pages"]}>
                {
                    pages?.map((page) => {
                        return (
                            <div key={page} className={`${classes["page"]} ${pagination?.page === page ? classes["active"] : ""}`} onClick={() => {if (pagination?.page !== page) handlePageNumberChange(page);}}>{page}</div>
                        )
                    })
                }
            </div>
            <button className={classes["next-handler"]} onClick={handlePageNext} disabled={!pagination?.next_page} aria-label="Next Page">
                <GrFormNextLink className={classes["next-icon"]} />
            </button>
        </section>
    )
}

export default BottomFeaturesBox