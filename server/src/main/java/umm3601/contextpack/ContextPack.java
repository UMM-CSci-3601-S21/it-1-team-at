package umm3601.contextpack;

import java.util.ArrayList;

import org.mongojack.Id;
import org.mongojack.ObjectId;

public class ContextPack {

  @ObjectId @Id
  public String _id;

  public String schema;
  public String name;
  public String icon;
  public boolean enabled;
  public ArrayList<WordPack> wordPack;

}
