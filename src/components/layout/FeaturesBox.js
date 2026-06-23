import classes from './FeaturesBox.module.scss';
import { FaSearch } from "react-icons/fa";
import { IoRefreshCircle } from "react-icons/io5";

const FeaturesBox = ({
    handleSubmit,
    searchPlaceholder,
    handleSearchChange,
    searchedValue = "",
    handelRefresh,
    // new props for millensys styling
    dateConfig = [],
    selectConfig = [],
    buttonsConfig = [],
    statusConfig = []
}) => {
    return (
        <section className={classes["features__container"]}>
            <div className={classes.feature_box}>
                <form className={classes.search_bar_container} onSubmit={handleSubmit}>
                    <input
                        type="search"
                        name="search"
                        className={classes.search_input}
                        placeholder={searchPlaceholder}
                        autoComplete='off'
                        onChange={handleSearchChange}
                        value={searchedValue}
                    />
                    <button type="submit" disabled={searchedValue === ''} className={classes.search_button}>
                        <FaSearch className={classes.search_icon} />
                    </button>
                </form>

                <div className={classes.buttons}>
                    <span className={classes.refreshButton} onClick={handelRefresh}>
                        <IoRefreshCircle />
                    </span>
                </div>
            </div>

            {(selectConfig.length > 0 || dateConfig.length > 0 || buttonsConfig.length > 0 || statusConfig.length > 0) && (
                <div className={classes.filters_box}>
                    {selectConfig.length > 0 && (
                        <div className={classes.selections_container}>
                            {selectConfig.map((option, index) => (
                                <div key={index} className={classes.input_control}>
                                    {option.label && <label>{option.label}</label>}
                                    <select value={option.value} onChange={(e) => option.onChange(e.target.value)}>
                                        <option value="">{option.placeholder || 'Select...'}</option>
                                        {option.options.map((opt, i) => (
                                            <option key={i} value={opt.value}>{opt.label}</option>
                                        ))}
                                    </select>
                                </div>
                            ))}
                        </div>
                    )}

                    {dateConfig.length > 0 && (
                        <div className={classes.date_input_container}>
                            {dateConfig.map((option, index) => (
                                <div key={index} className={classes.date_Control}>
                                    <label>{option.label}</label>
                                    <input
                                        type="date"
                                        value={option.value}
                                        onChange={option.onChange}
                                    />
                                </div>
                            ))}
                        </div>
                    )}

                    {statusConfig.length > 0 && (
                        <div className={classes.status_container}>
                            {statusConfig.map((option, index) => (
                                <div key={index} className={classes.input_control} style={{flexDirection: 'row', alignItems: 'center', gap: '5px'}}>
                                    <input
                                        type="checkbox"
                                        checked={option.checked(option.value)}
                                        onChange={(e) => option.onChange(e.target.checked, option.value)}
                                        id={`status-${index}`}
                                    />
                                    <label htmlFor={`status-${index}`} style={{margin: 0}}>{option.label}</label>
                                </div>
                            ))}
                        </div>
                    )}

                    {buttonsConfig.length > 0 && (
                        <div className={classes.actions_container}>
                            {buttonsConfig.map((option, index) => (
                                <button
                                    key={index}
                                    type="button"
                                    onClick={option.onClick}
                                    disabled={option.disabled}
                                    className={classes.action_button}
                                >
                                    {option.label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </section>
    );
};

export default FeaturesBox;
