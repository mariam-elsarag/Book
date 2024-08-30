import React from "react";

const SpinnerFullPage = () => {
  return (
    <div className="fixed inset-0 bg-white flex items-center justify-center">
      <div class="bookshelf_wrapper">
        <ul class="books_list">
          <li class="book_item first"></li>
          <li class="book_item second"></li>
          <li class="book_item third"></li>
          <li class="book_item fourth"></li>
          <li class="book_item fifth"></li>
          <li class="book_item sixth"></li>
        </ul>
        <div class="shelf"></div>
      </div>
    </div>
  );
};

export default SpinnerFullPage;
