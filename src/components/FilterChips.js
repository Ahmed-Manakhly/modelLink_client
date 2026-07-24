import { useSearchParams } from 'react-router-dom';
import classes from './FilterChips.module.scss';
import { getFilterChips, removeFilterKeys } from '../utility/marketplaceFilters';

function FilterChips({ labelContext = {}, children, currentParams, onRemoveChip, onClearAllChips }) {
    const [searchParams, setSearchParams] = useSearchParams();
    const paramsToUse = currentParams || searchParams;
    const chips = getFilterChips(paramsToUse, labelContext);

    const onRemove = (removeKeys) => {
        if (onRemoveChip) {
            onRemoveChip(removeKeys);
        } else {
            setSearchParams(removeFilterKeys(searchParams, removeKeys));
        }
    };

    const onClearAll = () => {
        if (onClearAllChips) {
            onClearAllChips();
        } else {
            const next = new URLSearchParams();
            setSearchParams(next);
        }
    };

    return (
        <div className={classes.container}>
            <div className={classes.row}>
                {chips.map((chip) => (
                    <button
                        key={chip.id}
                        type="button"
                        className={classes.chip}
                        onClick={() => onRemove(chip.removeKeys)}
                        aria-label={`Remove filter ${chip.label}`}
                    >
                        <span>{chip.label}</span>
                        <span className={classes.remove} aria-hidden="true">
                            ×
                        </span>
                    </button>
                ))}
            </div>
            {chips.length > 0 && (
                <button type="button" className={classes.reset} onClick={onClearAll}>
                    Reset all filters
                </button>
            )}
            {children}
        </div>
    );
}

export default FilterChips;
