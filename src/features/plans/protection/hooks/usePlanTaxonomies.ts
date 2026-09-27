import { useSelector } from 'react-redux';
import type { RootState } from '../../../../store';
import { CATEGORIES_CONSTANTS as CC } from '../../../access-and-permissions/categories/constants';
import { useCategories } from '../../../access-and-permissions/categories/hooks';
import { selectCategoriesByScope } from '../../../access-and-permissions/categories/store/selectors/categorySelectors';

export const usePlanTaxonomies = () => {
  const { categories: environments } = useCategories(CC.SCOPES.PLAN_ENVIRONMENTS);
  const { categories: tags } = useCategories(CC.SCOPES.PLAN_TAGS);
  return { environments, tags };
};

export const usePlanTaxonomyLists = () => {
  const environments = useSelector((s: RootState) =>
    selectCategoriesByScope(s, CC.SCOPES.PLAN_ENVIRONMENTS),
  );
  const tags = useSelector((s: RootState) => selectCategoriesByScope(s, CC.SCOPES.PLAN_TAGS));
  return { environments, tags };
};
