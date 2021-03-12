package umm3601.contextpack;

import java.util.ArrayList;
import java.util.List;

import com.google.common.collect.ImmutableMap;
import com.mongodb.client.MongoDatabase;
import com.mongodb.client.model.Sorts;

import org.bson.Document;
import org.bson.conversions.Bson;
import org.mongojack.JacksonMongoCollection;
import io.javalin.http.Context;
import static com.mongodb.client.model.Filters.eq;
import static com.mongodb.client.model.Filters.and;

public class ContextPackController {

private static final String NAME_KEY = "name";
private final JacksonMongoCollection<ContextPack> contextPackCollection;

/**
 * Construct a controller for the context packs
 *
 * @param database the database containing context Pack data
 */
public ContextPackController(MongoDatabase database) {
  contextPackCollection = JacksonMongoCollection.builder().build(database, "contextPacks", ContextPack.class);
}

 /**
   * Get a JSON response with a list of all the context packs.
   *
   * @param ctx a Javalin HTTP context
   */
  public void getContextPacks(Context ctx) {

    List<Bson> filters = new ArrayList<>(); // start with a blank document

    if (ctx.queryParamMap().containsKey(NAME_KEY)) {
      filters.add(eq(NAME_KEY, ctx.queryParam(NAME_KEY)));
    }

    //String sortBy = ctx.queryParam("sortby", "name"); //Sort by sort query param, default is name
    //String sortOrder = ctx.queryParam("sortorder", "asc");

    ctx.json(contextPackCollection.find(filters.isEmpty() ? new Document() : and(filters)).into(new ArrayList<>()));
  }

/**
 *  Get a JSON response with a list of all the context Packs.
 *
 * @param ctx a Javalin HTTP context
 */
public void addNewContextPack(Context ctx) {
  ContextPack newContextPack = ctx.bodyValidator(ContextPack.class)
    .check(cp -> cp.name != null && cp.name.length() > 0) //Verify that the context Pack has a name that is not blank
    .check(cp -> cp.icon != null && cp.icon.length() > 0) //Verify that the context Pack has a icon that is not blank
    .check(cp -> cp.enabled == false || cp.enabled == true)//Verify that the enabled is true or false
    .check(cp -> cp.wordPacks != null)//Verify that the array is not empty
    .get();

  contextPackCollection.insertOne(newContextPack);
  ctx.status(201);
  ctx.json(ImmutableMap.of("name", newContextPack.name));
}

}
