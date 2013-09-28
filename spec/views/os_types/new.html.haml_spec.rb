require 'spec_helper'

describe "os_types/new" do
  before(:each) do
    assign(:os_type, stub_model(OsType,
      :name => "MyString",
      :family => "MyString",
      :desc => "MyString"
    ).as_new_record)
  end

  it "renders new os_type form" do
    render

    # Run the generator again with the --webrat flag if you want to use webrat matchers
    assert_select "form[action=?][method=?]", os_types_path, "post" do
      assert_select "input#os_type_name[name=?]", "os_type[name]"
      assert_select "input#os_type_family[name=?]", "os_type[family]"
      assert_select "input#os_type_desc[name=?]", "os_type[desc]"
    end
  end
end
