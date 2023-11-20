const chargebee = require('chargebee');

chargebee.configure({
    site: 'fleetr',
    api_key: 'live_kZ8aVbzaTcuQzJKKvPMyw4kjAdRFRXr86'
});

export async function fetchJson(url, headers) {
    const response = await fetch(url, { headers });
    return response.json();
}

export async function getCustomerByEmail(customerEmail) {
    try {
        const headers = new Headers({ "Authorization": "Basic bGl2ZV9rWjhhVmJ6YVRjdVF6SktLdlBNeXc0a2pBZFJGUlhyODY6" });
        const url = `https://fleetr.chargebee.com/api/v2/customers?email[is]=${customerEmail}`;
        const result = await fetchJson(url, headers);
        return result.list[0].customer;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function main() {
    try {
        const customer = await getCustomerByEmail(email);
        customer ? console.log(customer.id) : console.log('customer not found');
    } catch (error) {
        console.error('Error:', error.message);
    }
}

main()