package umm3601.contextpack;

import static com.mongodb.client.model.Filters.eq;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.google.common.collect.ImmutableMap;
import com.mockrunner.mock.web.MockHttpServletRequest;
import com.mockrunner.mock.web.MockHttpServletResponse;
import com.mongodb.MongoClientSettings;
import com.mongodb.ServerAddress;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;

import org.bson.Document;
import org.bson.types.ObjectId;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import io.javalin.http.BadRequestResponse;
import io.javalin.http.Context;
import io.javalin.http.NotFoundResponse;
import io.javalin.http.util.ContextUtil;
import io.javalin.plugin.json.JavalinJson;

public class ContextPackControllerSpec {

  MockHttpServletRequest mockReq = new MockHttpServletRequest();
  MockHttpServletResponse mockRes = new MockHttpServletResponse();


  private MongoCollection<Document> contextPackDocuments;

  static MongoClient mongoClient;
  static MongoDatabase db;

  private ContextPackController packController;

  private ObjectId testIDOne;
  private ObjectId testIDTwo;
  private ObjectId testIDThree;

  static ObjectMapper jsonMapper = new ObjectMapper();

  @BeforeAll
  public static void setupDB() {
    String mongoAddr = System.getenv().getOrDefault("MONGO_ADDR", "localhost");

    mongoClient = MongoClients.create(
      MongoClientSettings.builder()
      .applyToClusterSettings(builder ->
        builder.hosts(Arrays.asList(new ServerAddress(mongoAddr))))
      .build());

    db = mongoClient.getDatabase("test");
  }

  @AfterAll
  public static void teardown() {
    db.drop();
    mongoClient.close();
  }

  @BeforeEach
  public void clearAndPopulateDB() {

    //reset mock values
    mockReq.resetAll();
    mockRes.resetAll();

    //set up db
    contextPackDocuments = db.getCollection("contextPacks");
    contextPackDocuments.drop();
    testIDOne = new ObjectId();
    testIDTwo = new ObjectId();
    testIDThree = new ObjectId();
    List<Document> testPacks = new ArrayList<>();
    testPacks.add(
      new Document()
        .append("_id", testIDOne )
        .append("schema", "../schema/pack.schema.json")
        .append("name", "Example 1")
        .append("icon", "example.png")
        .append("enabled", false)
        .append("wordPacks", Arrays.asList(
          new Document()
          .append("name", "Example 1")
          .append("enabled", false)
          .append("nouns", Arrays.asList(
            new Document()
            .append("word", "This")
            .append("forms", Arrays.asList("THIS"))
          ))
          .append("verbs", Arrays.asList(
            new Document()
            .append("word", "Is")
            .append("forms", Arrays.asList("IS"))
          ))
          .append("adjectives", Arrays.asList(
            new Document()
            .append("word", "An")
            .append("forms", Arrays.asList("AN"))
          ))
          .append("misc", Arrays.asList(
            new Document()
            .append("word", "Example")
            .append("forms", Arrays.asList("EXAMPLE"))
          ))
        )));
    testPacks.add(
      new Document()
        .append("_id",testIDTwo)
        .append("schema", "../schema/pack.schema.json")
        .append("name", "Example 2")
        .append("icon", "example.png")
        .append("enabled", false)
        .append("wordPacks", Arrays.asList(
          new Document()
          .append("name", "Example 2")
          .append("enabled", false)
          .append("nouns", Arrays.asList(
            new Document()
            .append("word", "This")
            .append("forms", Arrays.asList("THIS"))
          ))
          .append("verbs", Arrays.asList(
            new Document()
            .append("word", "Is")
            .append("forms", Arrays.asList("IS"))
          ))
          .append("adjectives", Arrays.asList(
            new Document()
            .append("word", "An")
            .append("forms", Arrays.asList("AN"))
          ))
          .append("misc", Arrays.asList(
            new Document()
            .append("word", "Example")
            .append("forms", Arrays.asList("EXAMPLE"))
          ))
        )));
    testPacks.add(
      new Document()
        .append("_id", testIDThree)
        .append("schema", "../schema/pack.schema.json")
        .append("name", "Example 3")
        .append("icon", "example.png")
        .append("enabled", false)
        .append("wordPacks", Arrays.asList(
          new Document()
          .append("name", "Example 3")
          .append("enabled", false)
          .append("nouns", Arrays.asList(
            new Document().append("word", "This").append("forms", Arrays.asList("THIS"))
          ))
          .append("verbs", Arrays.asList(
            new Document().append("word", "Is").append("forms", Arrays.asList("IS"))
          ))
          .append("adjectives", Arrays.asList(
            new Document().append("word", "An").append("forms", Arrays.asList("AN"))
          ))
          .append("misc", Arrays.asList(
            new Document().append("word", "Example").append("forms", Arrays.asList("EXAMPLE"))
          ))
        )));
    contextPackDocuments.insertMany(testPacks);
    packController = new ContextPackController(db);
  }

  @Test
  public void shouldGetAllPacks() throws IOException {

    Context ctx = ContextUtil.init(mockReq, mockRes, "api/contextpacks");
    packController.getContextPacks(ctx);

    assertEquals(200, mockRes.getStatus());

    String result = ctx.resultString();
    System.err.println(result);
    assertEquals(contextPackDocuments.countDocuments(), JavalinJson.fromJson(result, ContextPack[].class).length);
  }

  @Test
  public void shouldGetExampleOnePack() throws IOException {

    mockReq.setQueryString("name=Example 1");
    Context ctx = ContextUtil.init(mockReq, mockRes, "api/contextPacks");
    packController.getContextPacks(ctx);

    assertEquals(200, mockRes.getStatus());
    String result = ctx.resultString();
    ContextPack[] resultPacks = JavalinJson.fromJson(result, ContextPack[].class);

    assertEquals(1,resultPacks.length);
    assertEquals("Example 1", resultPacks[0].name);
  }

  @Test
  public void ShouldSortByName() {

    Context ctx = ContextUtil.init(mockReq, mockRes, "api/contextPacks");
    packController.getContextPacks(ctx);

    assertEquals(200, mockRes.getStatus());
    String result = ctx.resultString();
    ContextPack[] resultPacks = JavalinJson.fromJson(result, ContextPack[].class);

    assertEquals(3, resultPacks.length, "Should be 3");
    assertEquals("Example 1",resultPacks[0].name);
    assertEquals("Example 2", resultPacks[1].name);
    assertEquals("Example 3", resultPacks[2].name);
  }

  @Test
  public void shouldGetNoPacks() throws IOException {

    mockReq.setQueryString("name=Example 100000");
    Context ctx = ContextUtil.init(mockReq, mockRes, "api/contextPacks");
    packController.getContextPacks(ctx);

    assertEquals(200, mockRes.getStatus());
    String result = ctx.resultString();
    ContextPack[] resultPacks = JavalinJson.fromJson(result, ContextPack[].class);

    assertEquals(0,resultPacks.length);
  }

  @Test
  public void GetPackWithExistentId() throws IOException {
    String testID = testIDThree.toHexString();
    Context ctx = ContextUtil.init(mockReq, mockRes, "api/contextpacks/:id", ImmutableMap.of("id", testID));
    packController.getContextPack(ctx);

    assertEquals(200, mockRes.getStatus());

    String result = ctx.resultString();
    ContextPack resultPack = JavalinJson.fromJson(result, ContextPack.class);

    assertEquals(resultPack._id, testIDThree.toHexString());
    assertEquals(resultPack.name, "Example 3");
  }

  @Test
  public void GetPackWithBadId() throws IOException {

    Context ctx = ContextUtil.init(mockReq, mockRes, "api/contextpacks/:id", ImmutableMap.of("id", "bad"));

    assertThrows(BadRequestResponse.class, () -> {
      packController.getContextPack(ctx);
    });
  }

  @Test
  public void GetPackWithNoId() throws IOException {

    Context ctx = ContextUtil.init(mockReq, mockRes, "api/contextpacks/:id", ImmutableMap.of("id", "58af3a600343927e48e87335"));

    assertThrows(NotFoundResponse.class, () -> {
      packController.getContextPack(ctx);
    });
  }


  @Test
  public void shouldAddContextPack() throws IOException{
    String newContextPack = "{"
      + " \"name\": \"Test Pack\" ,"
      + " \"icon\": \"testIcon.png\" ,"
      + " \"enabled\": false ,"
      + " \"wordPacks\": [{"
      + " \"name\": \"Test Word Pack\" ,"
      + " \"enabled\": false ,"
      + " \"nouns\":"
      + "[{\"word\": \"Practice\", \"forms\": [ \"Practices\", \"Practice\" ] }],"
      + " \"verbs\":"
      + "[{\"word\": \"Makes\", \"forms\": [ \"Makes\", \"Make\" ] }],"
      + " \"adjectives\":"
      + "[{\"word\": \"Perfect\", \"forms\": [ \"Perfect\" ] }],"
      + " \"misc\":"
      + "[{\"word\": \"Yay\", \"forms\": [ \"Yay\"] }]"
      + "}]}";

    mockReq.setBodyContent(newContextPack);
    mockReq.setMethod("POST");
    Context ctx = ContextUtil.init(mockReq, mockRes, "api/contextPacks");


    packController.addNewContextPack(ctx);
    assertEquals(201, mockRes.getStatus());
    String result = ctx.resultString();
    String id = jsonMapper.readValue(result, ObjectNode.class).get("_id").asText();

    assertNotEquals("", id);
    assertEquals(1, db.getCollection("contextPacks").countDocuments(eq("_id", new ObjectId(id))));

    Document addedPack = db.getCollection("contextPacks").find(eq("_id", new ObjectId(id))).first();
    assertNotNull(addedPack);
    assertEquals("Test Pack", addedPack.getString("name"));
    assertNotNull(addedPack);

  }

  @Test
  public void shouldThrowBadRequestNullName() throws IOException{
    String newContextPack = "{"
      + " \"name\": \"\","
      + " \"icon\": \"testIcon.png\" ,"
      + " \"enabled\": false ,"
      + " \"wordPacks\": [{"
      + " \"name\": \"Test Word Pack\" ,"
      + " \"enabled\": false ,"
      + " \"nouns\":"
      + "[{\"word\": \"Practice\", \"forms\": [ \"Practices\", \"Practice\" ] }],"
      + " \"verbs\":"
      + "[{\"word\": \"Makes\", \"forms\": [ \"Makes\", \"Make\" ] }],"
      + " \"adjectives\":"
      + "[{\"word\": \"Perfect\", \"forms\": [ \"Perfect\" ] }],"
      + " \"misc\":"
      + "[{\"word\": \"Yay\", \"forms\": [ \"Yay\"] }]"
      + "}]}";

      mockReq.setBodyContent(newContextPack);
      mockReq.setMethod("POST");
      Context ctx = ContextUtil.init(mockReq, mockRes, "api/contextPacks");

      assertThrows(BadRequestResponse.class, () -> {
        packController.addNewContextPack(ctx);
      });
  }

  @Test
  public void shouldThrowBadRequestNoName() throws IOException{
    String newContextPack = "{"
      + " \"icon\": \"testIcon.png\","
      + " \"enabled\": false ,"
      + " \"wordPacks\": [{"
      + " \"name\": \"Test Word Pack\" ,"
      + " \"enabled\": false ,"
      + " \"nouns\":"
      + "[{\"word\": \"Practice\", \"forms\": [ \"Practices\", \"Practice\" ] }],"
      + " \"verbs\":"
      + "[{\"word\": \"Makes\", \"forms\": [ \"Makes\", \"Make\" ] }],"
      + " \"adjectives\":"
      + "[{\"word\": \"Perfect\", \"forms\": [ \"Perfect\" ] }],"
      + " \"misc\":"
      + "[{\"word\": \"Yay\", \"forms\": [ \"Yay\"] }]"
      + "}]}";

    mockReq.setBodyContent(newContextPack);
    mockReq.setMethod("POST");
    Context ctx = ContextUtil.init(mockReq, mockRes, "api/contextPacks");

    assertThrows(BadRequestResponse.class, () -> {
      packController.addNewContextPack(ctx);
    });

  }

  @Test
  public void shouldThrowBadRequestNotBoolean() throws IOException{
    String newContextPack = "{"
      + " \"name\": \"Test Pack\" ,"
      + " \"icon\": \"testIcon.png\" ,"
      + " \"enabled\": \"not a boolean\" ,"
      + " \"wordPacks\": [{"
      + " \"name\": \"Test Word Pack\" ,"
      + " \"enabled\": false ,"
      + " \"nouns\":"
      + "[{\"word\": \"Practice\", \"forms\": [ \"Practices\", \"Practice\" ] }],"
      + " \"verbs\":"
      + "[{\"word\": \"Makes\", \"forms\": [ \"Makes\", \"Make\" ] }],"
      + " \"adjectives\":"
      + "[{\"word\": \"Perfect\", \"forms\": [ \"Perfect\" ] }],"
      + " \"misc\":"
      + "[{\"word\": \"Yay\", \"forms\": [ \"Yay\"] }]"
      + "}]}";

    mockReq.setBodyContent(newContextPack);
    mockReq.setMethod("POST");
    Context ctx = ContextUtil.init(mockReq, mockRes, "api/contextPacks");

    assertThrows(BadRequestResponse.class, () -> {
      packController.addNewContextPack(ctx);
    });
  }

  @Test
  public void shouldThrowBadRequestNoWordPack() throws IOException{
    String newContextPack = "{"
      + " \"name\": \"Test Pack\" ,"
      + " \"icon\": \"testIcon.png\" ,"
      + " \"enabled\": \"false\" }";
    mockReq.setBodyContent(newContextPack);
    mockReq.setMethod("POST");
    Context ctx = ContextUtil.init(mockReq, mockRes, "api/contextPacks");

    assertThrows(BadRequestResponse.class, () -> {
      packController.addNewContextPack(ctx);
    });
  }

}
