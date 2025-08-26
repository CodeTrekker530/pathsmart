import { supabase } from './supabaseClient.js';

export async function fetchProductAndServices(searchTerm = '') {
  const searchLower = searchTerm.toLowerCase();

  // Fetch matching products/services
  const { data: products, error: productError } = await supabase
    .from('ProductandServices')
    .select('PnS_id, name, category')
    .ilike('name', `%${searchLower}%`);

  if (productError) {
    console.error('Supabase Product fetch error:', productError.message);
    return [];
  }

  const pnsIds = products.map(p => p.PnS_id);

  // Fetch listings where PnS_id is in the above result
  const { data: listings, error: listingError } = await supabase
    .from('listing')
    .select(`
      PnS_id,
      Stall (
        node_id
      )
    `)
    .in('PnS_id', pnsIds);

  if (listingError) {
    console.error('Supabase Listing fetch error:', listingError.message);
  }

  // Map ProductandServices to their corresponding node_ids via listing
    const productResults = (products || []).map(p => {
      const relatedListings = listings?.filter(l => l.PnS_id === p.PnS_id) || [];
      const node_ids = relatedListings.map(l => l.Stall?.node_id).filter(Boolean);

      return {
        id: `${p.PnS_id}`,
        type: 'Product',
        name: p.name,
        category: p.category,
        price: '--',
        node_id: node_ids, // Array of node_ids
        image: 'image.png',
      };
    });


  // Fetch filtered stalls
  const { data: stalls, error: stallError } = await supabase
    .from('Stall')
    .select('stall_id, stall_name, stall_category, node_id')
    .ilike('stall_name', `%${searchLower}%`);

  if (stallError) {
    console.error('Supabase Stall fetch error:', stallError.message);
  }

  const stallResults = (stalls || []).map(item => ({
    id: item.stall_id.toString(),
    type: 'Stall',
    name: item.stall_name,
    category: item.stall_category,
    price: '--',
    node_id: item.node_id,
    image: 'image.png',
  }));

  console.log('Combined Search Results with node_id:');
  [...productResults, ...stallResults].forEach(res =>
    console.log(`${res.type}: ${res.name}, node_id: ${res.node_id}`)
  );

  return [...productResults, ...stallResults].slice(0, 20);
  
}
