class AddUsernameToOsTypes < ActiveRecord::Migration
  def change
    add_column :os_types, :username, :string
  end
end
