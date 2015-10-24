require 'paperclip/rack'
include Paperclip::Glue

class CreateImage < ActiveRecord::Migration
  def change
		enable_extension 'uuid-ossp'

    create_table :images do |t|
      t.attachment :file
      t.string :title
      t.text :description
    end

    add_column :images, :uuid, :uuid, :default => "uuid_generate_v4()"
	end
end
