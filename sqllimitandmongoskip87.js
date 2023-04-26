ITEM_PER_PAGE = 2
page will be 1 then 2 then 3 supplied from get or query param
Product.find().skip((page - 1) * ITEMS_PER_PAGE)

in case of sql we use
$sql = "SELECT * FROM Orders LIMIT 10 OFFSET 15";
this means start from record 16 and return only 10 records

$sql = "SELECT * FROM Orders LIMIT 15, 10";
this is equal to previous methods
