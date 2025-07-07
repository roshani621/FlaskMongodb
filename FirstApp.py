from flask import Flask, request, jsonify 
from pymongo import MongoClient
from flask_cors import CORS
import random
from bson import ObjectId
from datetime import datetime
import pytz
app = Flask(__name__)
CORS(app)

client = MongoClient("mongodb://localhost:27017/")  # change URI if needed
db = client["mydatabase"]
collection = db["UserBooks"]
BookCol = db['Books']
UsersCol = db['Users']

@app.route('/', methods=['GET'])
def greet():
    return jsonify({"message": "Welcome to the Book API!"})

@app.route('/user-book', methods=['POST'])
def UserBook():
    if request.method == 'POST':

        data = request.get_json()

        borrow_date = data.get("borrow_date")
        borrow_date_str = datetime.strptime(borrow_date, "%Y-%m-%d %H:%M:%S")
        print("Received borrow_date_str:", borrow_date_str)


        return_date = data.get("return_date")
        
        if return_date:
            return_date_str = datetime.strptime(return_date, "%Y-%m-%d %H:%M:%S")
        else: 
            return_date_str = None

        issue_id = "ISSUE"+str(random.randint(1000, 1000000))

        
        
        userBooks = {
            "issue_id": issue_id,
            "user_id": data.get("user_id"),
            "book_id": data.get("book_id"),
            "borrow_date": borrow_date_str,
            "returned_date": return_date_str,
            "status": data.get("status"),
            "rating": data.get("rating"),
            "review": data.get("review")
        }   

        

        book_db = collection.insert_one(userBooks)
        print(book_db)
        print(userBooks)
        return jsonify({
            "message": "Issue book details saved successfully!",
            "issue_id": issue_id
        }), 201
    
    return jsonify({"message": "Send a POST request with book data"}), 200


@app.route('/book', methods=['POST'])
def add_book():
    if request.method == 'POST':
        
        book = request.get_json()

        book_id = "B" + str(random.randint(1000, 1000000))

        added_date_str = book.get("added_date")
        added_date = datetime.strptime(added_date_str, "%Y-%m-%d")
        

        books = {
            "adid": book_id,
            "title": book.get("title"),
            "publisher": book.get("publisher"),
            "author": book.get("author"),
            "quantity": book.get("quantity"),
            "available": book.get("available"),
            "category": book.get("category"),
            "added_date": added_date,
        } 

        result = BookCol.insert_one(books)
        print(result)
        return jsonify({
            "message": "Book registered successfully!",
              "book_id": book_id
        }), 201
    

@app.route('/user', methods=['POST'])
def add_user():
    if request.method == 'POST':
        
        user = request.get_json()

        user_id = "U" + str(random.randint(1000, 1000000))

        mem_date = user.get("membership_date")
        added_date = datetime.strptime(mem_date, "%Y-%m-%d %H:%M:%S")

        users = {
            "user_id": user_id,
            "name": user.get("name"),
            "email": user.get("email"),
            "phone": user.get("phone"),
            "membership_date": added_date
        } 
        print(added_date)


        result = UsersCol.insert_one(users)
        print(result)
        return jsonify({
            "message": "User registered successfully!",
              "user_id": user_id
        }), 201
    
@app.route('/book-borrow', methods=['GET'])
def BookBorrow():
    pipeline = [
        {
            "$lookup": {
                "from": "Users",
                "localField": "user_id",
                "foreignField": "user_id",
                "as": "user_info"
            }
        },
        {
            "$unwind": "$user_info"
        },
        {
            "$lookup":{
                "from": "Books",
                "localField": "book_id",
                "foreignField": "adid",
                "as": "book_info"
            }
        },
        {
            "$unwind": "$book_info"
        },
        {
            "$project": {
                "_id": 0,
                "user_name": "$user_info.name",
                "book_name": "$book_info.title",
                "author_name": "$book_info.author",
                "available": "$book_info.available",
                "category": "$book_info.category",
                "borrow_date": 1,
                "returned_date": 1,
                "status": 1,
                "rating": 1
            }
        }
    ]

    result = list(collection.aggregate(pipeline))

    # for doc in result:
    #     doc['_id'] = str(doc['_id'])
    return jsonify(result)


@app.route('/dashboard', methods=['GET'])
def Dashboard():
    borrow_return_pipeline  = [
        {
            "$group": {
                "_id": "$status",
                "count": {"$sum": 1}
            }
        }
    ]

    available_total_pipeline = [
        {
            "$group":{
                "_id": None,
                "totalAvailable": {"$sum": {"$toInt": "$available"}},
                "totalBooks": {"$sum": {"$toInt": "$quantity"}}
            }
        }
    ]

    user_count = UsersCol.count_documents({"status": "active"})
    print(user_count)

    # borrow_book_count = collection.count_documents({"status": "Borrowed"}) 
    # print(borrow_book_count)

    # returned_book_count = collection.count_documents({"status": "Returned"})
    # print(returned_book_count)

    borrow_return_book = list(collection.aggregate(borrow_return_pipeline))
    print(borrow_return_book)

    available_total_book = list(BookCol.aggregate(available_total_pipeline))
    print(available_total_book)

    return jsonify({
        "active_user": user_count,
        # "borrow_count": borrow_book_count,
        # "returned_count": returned_book_count,
        "books": borrow_return_book,
        "availableBook": available_total_book
        
    })

@app.route('/search', methods=['POST'])
def Search():
    search_text = request.get_json().get("text", "")
   
    results = BookCol.find({
        "$or": [
            { "title": { "$regex": search_text, "$options": "i" } },
            { "category": { "$regex": search_text, "$options": "i" } },
            { "author": { "$regex": search_text, "$options": "i" } }
        ]
    })

    data = []
    for doc in results:
        doc['_id'] = str(doc['_id'])
        data.append(doc)

    return jsonify(data)

if __name__ == '__main__':
    app.run(debug=True)