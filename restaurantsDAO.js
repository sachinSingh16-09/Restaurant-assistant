let restaurants;

export default class RestaurantsDAO {
  static async injectDB(conn) {
    if (restaurants) {
      return;
    }
    try {
      restaurants = await connection
        .db(process.env.RESTREVIEWS_NS)
        .collections('restaurants');
    } catch (e) {
      console.error(
        `unable to establish a collection handle in restaurantsDAO: ${e}`,
      );
    }
  }

  static async getRestaurants({
    filters = null,
    page = 0,
    restaurantsPerPage = 20,
  } = {}) {
    let query;
    if (filters) {
      if ('name' in filters) {
        query = { $text: { $search: filters['name'] } };
      } else if ('cuisine' in filters) {
        query = { cuisine: { $eq: filters['cuisine'] } };
      } else if ('zipcode' in filters) {
        query = { 'address.zipcode': { $eq: filters['zipcode'] } };
      }
    }

    let cursor;

    try {
      cursor = await restaurants.find(query);
    } catch (e) {
      console.error(`unable to issue find command, ${e}`);
      return { restaurantsList: [], totalNumRestaurants: 0 };
    }

    const displayCursor = cursor
      .limit(restaurantsPerPage)
      .skip(restaurantsPerPage * page);

    try {
      const restaurantsList = await displayCursor.toArray();
      const totalNumRestaurants = await restaurants.countDocuments(query);
      return { restaurantsList, totalNumRestaurants };
    } catch (e) {
      console.error(
        `unable to convert cursor to array or problem counting documents, ${e}`,
      );
      return { restaurantsList: [], totalNumRestaurants: 0 };
    }
  }
}
