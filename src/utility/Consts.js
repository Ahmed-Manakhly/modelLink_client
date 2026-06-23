
export const range = [
    { name: "--Please Choose An Option--", code: "0" },
];

export const searchBy = [
    { name: "Search Any", code: "search", field: "search" },
    { name: "Exact Model Title", code: "title", field: "title" },
    { name: "Exact Model Description", code: "desc", field: "desc" },
    { name: "Exact Category", code: "category", field: "categoryRel.name" },
    { name: "Exact Developer Username", code: "developer", field: "developer.org_username" },
    { name: "Exact Developer Org Name", code: "devOrgName", field: "developer.org_name" },
    { name: "Exact Developer First Name", code: "devFirstName", field: "developer.first_name" },
    { name: "Exact Developer Last Name", code: "devLastName", field: "developer.last_name" },
    { name: "Exact Developer Email", code: "devEmail", field: "developer.email" },
    { name: "Exact Developer Country", code: "devCountry", field: "developer.country" },
    { name: "Exact Use Cases", code: "useCases", field: "versions.indications" },
];

export const SEARCH_URL_PARAMS = searchBy
    .map((item) => item.field)
    .filter(Boolean);
