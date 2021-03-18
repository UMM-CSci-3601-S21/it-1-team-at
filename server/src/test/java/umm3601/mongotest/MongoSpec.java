package umm3601.mongotest;

import com.mongodb.MongoClientSettings;
import com.mongodb.ServerAddress;
import com.mongodb.client.*;
import com.mongodb.client.model.Sorts;
import org.bson.Document;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import static com.mongodb.client.model.Filters.*;
import static com.mongodb.client.model.Projections.*;

import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;
/**
 * Some simple "tests" that demonstrate our ability to
 * connect to a Mongo database and run some basic queries
 * against it.
 * Created by McPhee on 20/2/17.
 *
 * Configured for Team AT by Team AT on 10/3/21
 */
public class MongoSpec {

  private MongoCollection<Document> contextPackDocuments;

  static MongoClient mongoClient;
  static MongoDatabase db;

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
      //set up db
      contextPackDocuments = db.getCollection("packs");
      contextPackDocuments.drop();
      List<Document> testPacks = new ArrayList<>();
      testPacks.add(
        new Document()
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
          .append("name", "Example 2")
          .append("icon", "example.png")
          .append("enabled", true)
          .append("wordPacks", Arrays.asList(
            new Document()
            .append("name", "Example 2")
            .append("enabled", true)
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
          .append("name", "Example 3")
          .append("icon", "example.png")
          .append("enabled", false)
          .append("wordPacks", Arrays.asList(
            new Document()
            .append("name", "Example 3")
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
      contextPackDocuments.insertMany(testPacks);
    }

  private List<Document> intoList(MongoIterable<Document> documents) {
    List<Document> contextPacks = new ArrayList<>();
    documents.into(contextPacks);
    return contextPacks;
  }

  private int countPacks(FindIterable<Document> documents) {
    List<Document> contextPacks = intoList(documents);
    return contextPacks.size();
  }

  @Test
  public void shouldBeThreePacks() {
    FindIterable<Document> documents = contextPackDocuments.find();
    int numberOfPacks = countPacks(documents);
    assertEquals(3, numberOfPacks, "Should be 3 total context packs");
  }

  @Test
  public void shouldBeOneExampleOne() {
    FindIterable<Document> documents = contextPackDocuments.find(eq("name", "Example 1"));
    int numberOfPacks = countPacks(documents);
    assertEquals(1, numberOfPacks, "Should be 1 Example 1");
  }

  @Test
  public void samePNGSortedByName() {
    FindIterable<Document> documents
      = contextPackDocuments.find(eq("icon", "example.png"))
      .sort(Sorts.ascending("name"));
    List<Document> docs = intoList(documents);
    assertEquals(3, docs.size(), "Should be 3");
    assertEquals("Example 1", docs.get(0).get("name"), "First should be Example 1");
    assertEquals("Example 2", docs.get(1).get("name"), "Second should be Example 2");
  }

  @Test
  public void justNameAndIcon() {
    FindIterable<Document> documents
      = contextPackDocuments.find().projection(fields(include("name", "icon")));
    List<Document> docs = intoList(documents);
    assertEquals(3, docs.size(), "Should be 3");
    assertEquals("Example 1", docs.get(0).get("name"), "First should be Example 1");
    assertNotNull(docs.get(0).get("icon"), "First should have icon");
    assertNull(docs.get(0).get("enabled"), "First shouldn't have 'enabled'");
    assertNotNull(docs.get(0).get("_id"), "First should have '_id'");
  }
}
